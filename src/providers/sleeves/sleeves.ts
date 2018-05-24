import { Injectable, NgZone } from '@angular/core';
import { ModalController, Events, Platform } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';

import PouchDB from 'pouchdb';
import { Observable } from 'rxjs/Observable';
import { Feeds } from '../feeds';
import { PairManager } from './pair-manager';
import { ComManager } from './com-manager';

export enum SleeveStates {
    DEVICE_STATE_NONE = 0, //Don't add anything before this
    BLE_ADVERTISING = 1,
    BLE_PAIRED_AND_BONDED = 2,
    DEVICE_FEEDING_EXPECTED = 3,
    DEVICE_FEEDING = 4,
    DEVICE_FEEDING_PAUSED = 5,
    DEVICE_FEEDING_END = 6,
    DEVICE_RESET = 7,
    BLE_DISCONNECTED = 8,
    DEVICE_WEIGHING_COMPLETED = 9,
    DEVICE_VERTICAL_STABLE = 10,
    DEVICE_WIGGLING = 11,
    BUTTON_PRESSED = 12,
    DEVICE_WEIGHING_TIMEOUT = 13,
    VERTICAL_STABLE = 14,
    DEVICE_STATE_LAST = 15 //increment this number and all states before this
}

@Injectable()
export class Sleeves {
    isSyncing: boolean = false;
    isPairing: boolean = false;
    lastSyncTimestamp: number = 0;
    pairedSleeves: any[] = [];

    private localDb: any;
    private syncTimestampDb: any;
    // private defaultSleeveName: string = 'Philips Avent SCH820';
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
        return new Promise((resolve, reject) => {

            this.isPairing = true;

            this.comManager.pair()
                .then((pairedSleeve) => {
                    this.pairManager.storePairedSleeveId(pairedSleeve.id)
                    this.isPairing = false;
                    resolve(pairedSleeve);

                }).catch(() => {
                    this.isPairing = false;
                    reject();

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

    amountOfPairedSleeves(): Promise<any> {
        return new Promise((resolve) => {
            this.localDb.allDocs({
            }).then(result => {
                resolve(result.rows.length);
            })
        })
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