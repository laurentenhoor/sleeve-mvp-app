import { Injectable, NgZone } from '@angular/core';
import { ModalController, Events, Platform } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';

import PouchDB from 'pouchdb';
import { Observable } from 'rxjs/Observable';
import { Feeds } from '../feeds';
import { PairManager } from './pair-manager';
import { ComManager } from './com-manager';

@Injectable()
export class Sleeves {
    isSyncing: boolean = false;
    isPairing: boolean = false;
    lastSyncTimestamp: number = 0;
    pairedSleeves: any[] = [];

    private localDb: any;
    private syncTimestampDb: any;
    private defaultSleeveName: string = 'Philips Avent SCH820';
    private connectedDeviceId: string;
    private sleeveConnected: boolean = false;

    private dataBuffer: string = "";

    constructor(
        private ble: BLE,
        private feedsService: Feeds,
        private zone: NgZone,
        private events: Events,
        private pairManager: PairManager,
        private comManager: ComManager
    ) {
        this.localDb = new PouchDB('sleeves');
        this.syncTimestampDb = new PouchDB('syncTimestamp');
        // this.initPairedSleeves();
        this.initSyncTimestamp();
    }

    async scanAndConnect(retryResolve?, retryReject?): Promise<any> {
        // new part - not implemented yet
        this.isPairing = true;
        this.comManager.pair()
            .then((pairedSleeve) => {
                this.isPairing = false;
                this.pairManager.storePairedSleeveId(pairedSleeve.id)
            }).catch(() => {
                this.isPairing = false;
            })


        // old part - still functional
        this.isPairing = true;
        await this.pairManager.disconnectAll();
        return new Promise((resolve, reject) => {
            if (!retryResolve) {
                retryResolve = resolve;
                retryReject = reject;
            }
            this.initScan((connectedSleeve) => {
                console.log('Starting Forced Bonding', connectedSleeve)
                this.forceBonding()
                    .then(() => {
                        this.isPairing = false;
                        this.pairManager.storePairedSleeveId(connectedSleeve.id)
                        // this.storeSleeve(connectedSleeve.id);
                        retryResolve(connectedSleeve);
                    })
                    .catch((error) => {
                        console.error('Forcebonding error: ', JSON.stringify(error))
                        return this.scanAndConnect(resolve, reject);
                    });
            })
        })

    }

    isBluetoothEnabled(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.ble.isEnabled().then(() => {
                resolve();
            }).catch(() => {
                reject();
            })
        })
    }

    removeSleeve(sleeve): void {
        console.log('remove sleeve', sleeve)
        this.localDb.remove(sleeve)
    }

    storeSyncTimestamp() {
        console.log('storelast SyncTimeStamp');
        let id = 'lastTimestamp';
        let self = this;
        this.syncTimestampDb.get(id, function (err, doc) {
            self.syncTimestampDb.put({
                _id: id,
                _rev: doc ? doc._rev : null,
                timestamp: Date.now() - 2000,
                date: new Date()
            }, function (err, response) {
                if (err) { return console.log(err); }
            });
        });
    }

    private initSyncTimestamp(): void {
        this.syncTimestampDb.get(
            'lastTimestamp'
        ).then(doc => {
            this.lastSyncTimestamp = doc.timestamp;
        }).catch(error => console.error(error));

        this.syncTimestampDb.changes({ live: true, since: 'now', include_docs: true }).on('change', (change) => {
            if (change && change.doc && change.doc.timestamp) {
                this.zone.run(() => {
                    this.lastSyncTimestamp = change.doc.timestamp;
                })
            }
        });
    }

    // private async disconnectAll(): Promise<any> {
    //     await this.ble.stopScan();
    //     return new Promise((resolve, reject) => {
    //         let disconnectionCounter = 0;
    //         this.isSyncing = false;

    //         if (this.pairedSleeves.length == 0) {
    //             resolve();
    //         }

    //         this.pairedSleeves.forEach((sleeve) => {
    //             this.ble.disconnect(sleeve._id).then(
    //                 success => {
    //                     this.sleeveConnected = false;
    //                     console.log('disconnected', sleeve._id)
    //                     disconnectionCounter++;
    //                     if (disconnectionCounter == this.pairedSleeves.length) {
    //                         resolve();
    //                     }
    //                 },
    //                 error => {
    //                     console.error('disconnect', error)
    //                     reject();
    //                 }
    //             )
    //         });

    //     })
    // }

    amountOfPairedSleeves(): Promise<any> {
        return new Promise((resolve) => {
            this.localDb.allDocs({
            }).then(result => {
                resolve(result.rows.length);
            })
        })
    }

    // private initPairedSleeves(): void {
    //     this.localDb.allDocs({
    //         include_docs: true,
    //         attachments: true
    //     }).then(result => {
    //         this.pairedSleeves = result.rows.map((row) => { return row.doc });
    //     })
    //     this.localDb.changes({ live: true, since: 'now', include_docs: true }).on('change', (change) => {
    //         this.handleChange(change);
    //     });
    // }

    // private handleChange(change): void {
    //     let changedDoc = null;
    //     let changedIndex = null;

    //     this.pairedSleeves.forEach((doc, index) => {
    //         if (doc._id === change.id) {
    //             changedDoc = doc;
    //             changedIndex = index;
    //         }
    //     });

    //     //A document was deleted
    //     if (change.deleted) {
    //         this.zone.run(() => {
    //             this.pairedSleeves.splice(changedIndex, 1);
    //         });
    //     }
    //     else {
    //         //A document was updated
    //         if (changedDoc) {
    //             this.zone.run(() => {
    //                 this.pairedSleeves[changedIndex] = change.doc;
    //             });
    //         }
    //         //A document was added
    //         else {
    //             this.zone.run(() => {
    //                 this.pairedSleeves.unshift(change.doc);
    //             });
    //         }
    //     }
    // }

    private async initScan(successCallback) {
        console.log('initScan();')
        await this.ble.stopScan();
        this.ble.startScan([]).subscribe(
            device => this.onDeviceDiscovered(device, successCallback),
            error => console.error('scan error', error)
        );
    }

    private onDeviceDiscovered(device, successCallback) {
        console.log('discovered', JSON.stringify(device))
        if (device.name == this.defaultSleeveName && device.id != '6710B20A-EE92-44C1-B9B9-684D7B6E1F5D') { //SHREYDEVICE// && device.id != 'D7832B16-8B21-4BCB-906C-0B6779BB18D8'
            console.log('Found a bottle sleeve', device.id)
            this.ble.stopScan();
            this.connect(device.id, successCallback);
        }
    }

    angle(): Observable<any> {
        return Observable.create((observer) => {
            console.log('subscribeToAngle', this.connectedDeviceId)
            if (!this.sleeveConnected) {
                observer.error('no sleeve connected');
                return;
            }
            this.ble.startNotification(this.connectedDeviceId,
                '000030F1-0000-1000-8000-00805F9B34FB',
                '000063E8-0000-1000-8000-00805F9B34FB'
            ).subscribe(data => {
                var dataView = new DataView(data, 0);

                // console.log('Int8', dataView.getInt8(0));
                // console.log('Int16', dataView.getInt16(0));
                // console.log('Int32', dataView.getInt32(0));
                // console.log('UInt8', dataView.getUint8(0));
                // console.log('UInt16', dataView.getUint16(0));
                // console.log('UInt32', dataView.getUint32(0));

                let value = dataView.getInt8(0);
                observer.next(value);
            }, error => {
                console.error('state', error);
                observer.error('receiving state');
            })
        });
    }

    state(): Observable<any> {
        return Observable.create(observer => {
            console.log('subscribeToState', this.connectedDeviceId)
            if (!this.sleeveConnected) {
                observer.error('no sleeve connected');
                return;
            }
            this.ble.startNotification(this.connectedDeviceId,
                '000030f3-0000-1000-8000-00805f9b34fb',
                '000063eC-0000-1000-8000-00805f9b34fb'
            ).subscribe(data => {
                let value = this.bufferToHex(data);
                let decimalValue = parseInt(value, 16);
                // console.log('Reveived state: ', value)
                console.log('Reveived state: ', decimalValue)
                observer.next(decimalValue)
            }, error => {
                console.error('state', error);
                observer.error('receiving state');
            })
        })
    }

    async synchronizeFeeds() {
        await this.pairManager.disconnectAll();

        this.isSyncing = true;
        let self = this;

        if (this.sleeveConnected) {
            console.log('a sleeve is already connected')
            return self.feedData()
        } else {
            console.log('trying to connect and sync')
            return new Promise((resolve, reject) => {
                let uuids = this.pairedSleeves.map(item => { return item._id })
                // console.log('paired uuids to scan', uuids)
                if (!uuids || uuids.length == 0) {
                    return reject('no paired devices')
                }
                console.log('scanning for following ids', uuids)

                let timeout = 10;
                setTimeout(() => {
                    if (!this.isPairing) {
                        this.isSyncing = false
                        this.pairManager.disconnectAll();
                        console.log('scanning timeout')
                        reject('scanTimeout');
                    }
                }, timeout * 1000)
                self.ble.startScan([])
                    .subscribe(peripheral => {
                        // console.log('found a sleeve to synchronize feeds from!', peripheral._id)
                        uuids.forEach((uuid) => {
                            // console.log('Found device:', peripheral.name)
                            // console.log('compare', uuid, peripheral.id)
                            if (peripheral.id == uuid) {
                                // console.log('found a paired sleeve');
                                self.connect(peripheral.id, (device) => {
                                    // console.log('connected to a sleeve')
                                    self.feedData().then(feedData => {
                                        this.isSyncing = false;
                                        resolve(feedData)
                                    })
                                })
                            }
                        })
                    }, scanError => {
                        this.isSyncing = false;
                        reject('unable to scan: ' + scanError)
                    })

            })

        }
    }


    private handleData(data: ArrayBuffer) {
        let part: string = this.bytesToString(data);
        console.log('new data chunk', part)
        try {
            this.dataBuffer = this.dataBuffer + part;
            console.log('new databuffer', this.dataBuffer)
            JSON.parse(this.dataBuffer);
            return true;
        } catch (error) {
            console.error(error)
            return false;
        }
    }

    private feedData(): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log('subscribeToFeedData', this.connectedDeviceId)
            if (!this.sleeveConnected) {
                reject('unable to subscribeToFeedData: no sleeve connected');
                this.isSyncing = false;
            }
            this.ble.startNotification(this.connectedDeviceId,
                '000030F0-0000-1000-8000-00805F9B34FB',
                '000063E7-0000-1000-8000-00805F9B34FB'
            ).subscribe(data => {
                if (this.handleData(data)) {
                    console.log('successfully consolidated a JSON:', this.dataBuffer)
                    this.feedsService.createFeedFromSleeve(this.dataBuffer);
                    this.storeSyncTimestamp();
                    resolve(this.dataBuffer);
                    this.dataBuffer = "";
                    this.isSyncing = false;
                    this.pairManager.disconnectAll();
                }
            }, error => {
                console.error('error while receiving feedData', error)
                reject('unable to receive feedData');
                this.pairManager.disconnectAll();
                this.isSyncing = false;
            })
            this.sendDownloadFeedRequest();
        })
    }

    private sendDownloadFeedRequest() {
        this.ble.write(this.connectedDeviceId,
            '000030F0-0000-1000-8000-00805F9B34FB',
            '000063E7-0000-1000-8000-00805F9B34FB',
            this.stringToBytes('shrey')
        ).then(data => {
            console.log('successfully written the feed-download-request')
        }).catch(error => {
            console.error('error during writing the feed-download-request')
        })
    }


    private forceBonding() {
        console.log('Force bonding by reading the state characteristic')
        return new Promise((resolve, reject) => {
            this.ble.read(this.connectedDeviceId,
                '000030f3-0000-1000-8000-00805f9b34fb',
                '000063eC-0000-1000-8000-00805f9b34fb'
            ).then(() => {
                console.log('successful read');
                resolve();
            }).catch((error) => {
                console.log('unsuccessful read');
                reject(error);
            })
        })
    }

    private connect(deviceId, successCallback) {
        this.ble.connect(deviceId).subscribe(
            peripheral => {
                this.ble.stopScan();
                this.sleeveConnected = true;
                this.connectedDeviceId = deviceId;
                successCallback(peripheral);
                console.error('Successfully connected to sleeve', deviceId)
            },
            peripheral => {
                this.sleeveConnected = false;
                this.connectedDeviceId = null;
                console.error('disconnected from sleeve', deviceId);
                this.events.publish('sleeve-disconnected');
            }
        )
    }

    private bufferToHex(buffer: ArrayBuffer) {
        return Array.prototype.map.call(new Uint16Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
    }


    // ASCII only
    private stringToBytes(string) {
        let array = new Uint8Array(string.length);
        for (let i = 0, l = string.length; i < l; i++) {
            array[i] = string.charCodeAt(i);
        }
        return array.buffer;
    }

    // ASCII only
    private bytesToString(buffer) {
        return String.fromCharCode.apply(null, new Uint8Array(buffer));
    }

}