import { Injectable } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';

import PouchDB from 'pouchdb';
import { Observable } from 'rxjs/Observable';
import { Feeds } from './feeds';

@Injectable()
export class Sleeves {
    localDb: any;
    defaultSleeveName: string;
    connectedDeviceId: string;
    sleeveConnected: boolean;
    pairedSleeves: any[];

    constructor(
        private ble: BLE,
        private feedsSeverice: Feeds,
    ) {
        this.localDb = new PouchDB('sleeves');
        this.defaultSleeveName = 'Philips Avent SCH820';
        this.sleeveConnected = false;
        this.getPairedSleeves().then(pairedSleeves => this.pairedSleeves = pairedSleeves);
    }

    removeSleeve(sleeve): void {
        console.log('remove sleeve', sleeve)
        this.localDb.remove(sleeve)
    }

    disconnectAll() {
        this.getPairedSleeves().then(pairedSleeves => {
            pairedSleeves.forEach((sleeve) => {
                this.ble.disconnect(sleeve._id).then(
                    success => {
                        this.sleeveConnected = false;
                        console.log('disconnected', sleeve._id)
                    },
                    error => console.error('disconnect', error)
                )
            })
        })
    }

    getPairedSleeves(): Promise<any[]> {
        if (this.pairedSleeves) {
            return new Promise(resolve => {
                resolve(this.pairedSleeves)
            })
        }
        return new Promise(resolve => {
            this.localDb.allDocs({
                include_docs: true,
                attachments: true
            }).then(result => {
                this.pairedSleeves = result.rows.map((row) => { return row.doc });
                resolve(this.pairedSleeves)
                this.localDb.changes({ live: true, since: 'now', include_docs: true }).on('change', (change) => {
                    this.handleChange(change);
                });
            })
        });
    }

    handleChange(change) {
        let changedDoc = null;
        let changedIndex = null;

        this.pairedSleeves.forEach((doc, index) => {
            if (doc._id === change.id) {
                changedDoc = doc;
                changedIndex = index;
            }
        });
        //A document was deleted
        if (change.deleted) {
            this.pairedSleeves.splice(changedIndex, 1);
        }
        else {
            //A document was updated
            if (changedDoc) {
                this.pairedSleeves[changedIndex] = change.doc;
            }
            //A document was added
            else {
                this.pairedSleeves.unshift(change.doc);
            }
        }
    }

    storeSleeve(sleeveId): void {
        console.log('storeSleeve', sleeveId)
        let self = this;
        this.localDb.get(sleeveId, function (err, doc) {
            self.localDb.put({
                _id: sleeveId,
                _rev: doc ? doc._rev : null
            }, function (err, response) {
                if (err) { return console.log(err); }
            });
        });
    }

    scanAndConnect(): Observable<string> {
        console.log('scanAndConnect()')
        this.ble.stopScan();
        this.disconnectAll();
        return Observable.create(observer => {
            this.initScan((connectedSleeve) => {
                console.log('Starting Forced Bonding', connectedSleeve)
                this.forceBonding(connectedSleeve).then(() => {
                    console.log('It was not needed to force this bonding!')
                    observer.next(connectedSleeve.id);
                }, () => {
                    console.log('Forced a bonding by reading!')
                    observer.next(connectedSleeve.id);
                });
            })
        })
    }

    state(): Observable<any> {
        return Observable.create(observer => {
            console.log('subscribeToState', this.connectedDeviceId)
            if (!this.sleeveConnected) {
                observer.error('no sleeve connected');
            }
            this.ble.startNotification(this.connectedDeviceId,
                '000030f3-0000-1000-8000-00805f9b34fb',
                '000063eC-0000-1000-8000-00805f9b34fb'
            ).subscribe(data => {
                let value = this.bufferToHex(data);
                observer.next(value)

                if (value == '0500') {
                    // console.log('disconnect at a specific state')
                    // this.disconnectAll();
                }

            }, error => {
                console.error('state', error);
                observer.error('receiving state');
            })
        })
    }

    synchronizeFeeds() {
        let self = this;
        this.ble.stopScan();
        this.disconnectAll();
        if (this.sleeveConnected) {
            console.log('a sleeve is already connected')
            return self.feedData()
        } else {
            console.log('trying to connect and sync')
            return new Promise((resolve, reject) => {
                self.getPairedSleeves().then(list => {
                    let uuids = list.map(item => { return item._id })
                    // console.log('paired uuids to scan', uuids)
                    if (!uuids || uuids.length == 0) {
                        return reject('no paired devices')
                    }
                    // console.log('scanning for following ids', uuids)
                    self.ble.scan([], 30)
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
                                            resolve(feedData)
                                        })
                                    })
                                }
                            })
                        }, scanError => {
                            reject('unable to scan: ' + scanError)
                        })
                })
            })

        }
    }

    feedData(): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log('subscribeToFeedData', this.connectedDeviceId)
            if (!this.sleeveConnected) {
                reject('unable to subscribeToFeedData: no sleeve connected');
            }
            this.ble.startNotification(this.connectedDeviceId,
                '000030F0-0000-1000-8000-00805F9B34FB',
                '000063E7-0000-1000-8000-00805F9B34FB'
            ).subscribe(data => {
                let feedData = this.bytesToString(data);
                console.log('received feed data', feedData)
                this.feedsSeverice.createFeedFromSleeve(feedData);
                resolve(feedData);
                // this.disconnectAll();
            }, error => {
                console.error('error while receiving feedData', error)
                reject('unable to receive feedData');
                // this.disconnectAll();
            })
            this.sendDownloadFeedRequest();
        })
    }

    sendDownloadFeedRequest() {
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

    initScan(successCallback) {
        this.ble.startScan([]).subscribe(
            device => this.onDeviceDiscovered(device, successCallback),
            error => console.error('scan error', error)
        );
    }

    onDeviceDiscovered(device, successCallback) {
        console.log('discovered', JSON.stringify(device))
        if (device.name == this.defaultSleeveName) {
            console.log('Found a bottle sleeve', device.id)
            this.connect(device.id, successCallback);
        }
    }

    forceBonding(peripheral) {
        console.log('force bonding')
        return new Promise((resolve, reject) => {
            this.ble.read(peripheral.id,
                peripheral.characteristics[0].service,
                peripheral.characteristics[0].characteristic).then(
                    data => {
                        console.log('focebonding', data);
                        resolve();
                    },
                    error => {
                        console.error('forceBonding', error)
                        reject();
                    }
                )
        })
    }

    connect(deviceId, successCallback) {
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
                console.error('disconnected from sleeve', deviceId);
            }
        )

    }

    bufferToHex(buffer: ArrayBuffer) {
        return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
    }

    // ASCII only
    stringToBytes(string) {
        let array = new Uint8Array(string.length);
        for (let i = 0, l = string.length; i < l; i++) {
            array[i] = string.charCodeAt(i);
        }
        return array.buffer;
    }

    // ASCII only
    bytesToString(buffer) {
        return String.fromCharCode.apply(null, new Uint8Array(buffer));
    }

}
