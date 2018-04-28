import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import { ModalController } from 'ionic-angular';

import { BLE } from '@ionic-native/ble';
import { Observable } from 'rxjs/Observable';
import { Connecting } from '../pages/connecting/connecting';

@Injectable()
export class Sleeves {
    data: any;
    localDb: any;
    devices: any[] = [];
    defaultSleeveName: string;
    deviceId: string;
    sleeveConnected: boolean;
    pairedSleeves: any[];
    

    constructor(private ble: BLE,
        public modalCtrl: ModalController) {
        this.localDb = new PouchDB('sleeves');
        this.defaultSleeveName = 'Philips Avent SCH820';
        this.sleeveConnected = false;
    }

    removeSleeve(sleeve): void {
        console.log('remove sleeve', sleeve)
        this.localDb.remove(sleeve)
    }

    getPairedSleeves(): Promise<any> {
        console.log('getPairedSleeves')
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
        return Observable.create(observer => {
            this.initScan((connectedSleeve) => {
                console.log('successCallback inside scanAndConnect', connectedSleeve)
                observer.next(connectedSleeve);
            })
        })
    }

    state(): Observable<any> {
        return Observable.create(observer => {
            console.log('subscribeToState', this.deviceId)
            if (!this.sleeveConnected) {
                observer.error('no sleeve connected');
            }
            this.ble.startNotification(this.deviceId,
                '000030f3-0000-1000-8000-00805f9b34fb',
                '000063eC-0000-1000-8000-00805f9b34fb'
            ).subscribe(data => {
                observer.next(this.bufferToHex(data))
            }, error => {
                console.error('state', error);
                observer.error('receiving state');
            })
        })
    }
    

    synchronizeFeeds() {
        let self = this;
        if (this.sleeveConnected) {
            console.log('a sleeve is already connected')
            return self.feedData()
        } else {
            return new Promise((resolve, reject) => {
                self.getPairedSleeves().then(list => {
                    let uuids = list.map(item => { return item._id })
                    console.log('paired uuids to scan', uuids)                    
                    if (!uuids || uuids.length==0) {
                        return reject('no paired devices')
                    }
                    self.ble.scan([], 3)
                        .subscribe(peripheral => {
                            self.connect(peripheral.id, (deviceId) => {
                                self.feedData().then(feedData => {
                                    resolve(feedData)
                                })
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
            console.log('subscribeToFeedData', this.deviceId)
            if (!this.sleeveConnected) {
                reject('unable to subscribeToFeedData: no sleeve connected');
            }
            this.ble.startNotification(this.deviceId,
                '000030F0-0000-1000-8000-00805F9B34FB',
                '000063E7-0000-1000-8000-00805F9B34FB'
            ).subscribe(data => {
                let feedData = this.bytesToString(data);
                console.log('received feed data', feedData)
                resolve(feedData);
            }, error => {
                console.error('error while receiving feedData', error)
                reject('unable to receive feedData');
            })
            this.sendDownloadFeedRequest()
        })
    }

    isConnected() {
        return this.sleeveConnected;
    }

    sendDownloadFeedRequest() {
        this.ble.write(this.deviceId,
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
        this.devices = [];  // clear list

        this.ble.startScan([]).subscribe(
            device => this.onDeviceDiscovered(device, successCallback),
            error => console.error('scan error', error)
        );
    }

    onDeviceDiscovered(device, successCallback) {
        console.log('discovered', JSON.stringify(device))
        if (device.name == this.defaultSleeveName) {
            console.log('Found a bottle sleeve', device.id)
            this.deviceId = device.id;
            this.connect(device.id, successCallback);
        }
    }

    forceBonding(peripheral) {
        console.log('force bonding')
        this.ble.read(peripheral.id,
            peripheral.characteristics[0].service,
            peripheral.characteristics[0].characteristic).then(
                data => {
                    console.log('focebonding', data);
                },
                error => console.error('forceBonding', error)
            )
    }

    connect(deviceId, successCallback) {
        this.ble.connect(deviceId).subscribe(
            peripheral => {
                // this.forceBonding(peripheral);
                this.ble.stopScan();
                this.sleeveConnected = true;
                successCallback(deviceId);
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
