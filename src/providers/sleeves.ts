import { Injectable, NgZone } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';

import PouchDB from 'pouchdb';
import { Observable } from 'rxjs/Observable';
import { Feeds } from './feeds';

export
    enum SleeveStates {
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
    private localDb: any;
    private defaultSleeveName: string = 'Philips Avent SCH820';
    private connectedDeviceId: string;
    private sleeveConnected: boolean;
    private pairedSleeves: any[] = null;
    public isScanning: boolean = false;
    public dataBuffer: string = "";

    constructor(
        private ble: BLE,
        private feedsService: Feeds,
        private zone: NgZone
    ) {
        this.localDb = new PouchDB('sleeves');
        this.defaultSleeveName
        this.sleeveConnected = false;
        this.getPairedSleeves().then(pairedSleeves => this.pairedSleeves = pairedSleeves);
    }

    removeSleeve(sleeve): void {
        console.log('remove sleeve', sleeve)
        this.localDb.remove(sleeve)
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

    disconnectAll() {
        this.ble.stopScan();
        this.isScanning = false;
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
        if (this.pairedSleeves !== null) {
            console.log('follow-up sleeve promise')
            return new Promise(resolve => {
                console.log('resolve of paired sleeves', this.pairedSleeves)
                resolve(this.pairedSleeves)
            })
        }
        console.log('initial sleeve promise')
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


    private handleChange(change) {
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
            this.zone.run(() => {
                this.pairedSleeves.splice(changedIndex, 1);
            });
        }
        else {
            //A document was updated
            if (changedDoc) {
                this.zone.run(() => {
                    this.pairedSleeves[changedIndex] = change.doc;
                });
            }
            //A document was added
            else {
                this.zone.run(() => {
                    this.pairedSleeves.unshift(change.doc);
                });
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
        return Observable.create(observer => {
            this.initScan((connectedSleeve) => {
                console.log('Starting Forced Bonding', connectedSleeve)
                this.forceBonding(connectedSleeve).then(() => {
                    console.log('It was not needed to force this bonding!')
                    observer.next(connectedSleeve.id);
                }, () => {
                    console.log('Forced a bonding by reading!')
                    observer.next(connectedSleeve.id);
                }).catch(error => {
                    console.error('forcebonding error', error)
                });
            })
        })
    }

    private initScan(successCallback) {
        this.ble.stopScan();
        this.ble.startScan([]).subscribe(
            device => this.onDeviceDiscovered(device, successCallback),
            error => console.error('scan error', error)
        );
    }

    private onDeviceDiscovered(device, successCallback) {
        console.log('discovered', JSON.stringify(device))
        if (device.name == this.defaultSleeveName && device.id != '6710B20A-EE92-44C1-B9B9-684D7B6E1F5D') { //SHREYDEVICE// && device.id != 'D7832B16-8B21-4BCB-906C-0B6779BB18D8'
            this.ble.stopScan();
            console.log('Found a bottle sleeve', device.id)
            this.connect(device.id, successCallback);
        }
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


    stopScanning() {
        this.ble.stopScan();
        // this.disconnectAll();
    }

    synchronizeFeeds() {
        let self = this;
        this.ble.stopScan();
        this.isScanning = true;
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
                    console.log('scanning for following ids', uuids)
                    
                    let timeout = 10;
                    setTimeout(() => {
                        this.isScanning = false
                        console.log('scanning timeout')
                        reject('scanTimeout');
                    }, timeout * 1000)
                    self.ble.scan([], timeout)
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
                                            this.isScanning = false;
                                            resolve(feedData)
                                        })
                                    })
                                }
                            })
                        }, scanError => {
                            this.isScanning = false;
                            reject('unable to scan: ' + scanError)
                        })
                })
            })

        }
    }


    handleData(data: ArrayBuffer) {
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

    feedData(): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log('subscribeToFeedData', this.connectedDeviceId)
            if (!this.sleeveConnected) {
                reject('unable to subscribeToFeedData: no sleeve connected');
                this.isScanning = false;
            }
            this.ble.startNotification(this.connectedDeviceId,
                '000030F0-0000-1000-8000-00805F9B34FB',
                '000063E7-0000-1000-8000-00805F9B34FB'
            ).subscribe(data => {
                if (this.handleData(data)) {
                    console.log('successfully consolidated a JSON:', this.dataBuffer)
                    this.feedsService.createFeedFromSleeve(this.dataBuffer);
                    resolve(this.dataBuffer);
                    this.dataBuffer = "";
                    this.isScanning = false;
                    this.disconnectAll();
                }
            }, error => {
                console.error('error while receiving feedData', error)
                reject('unable to receive feedData');
                this.disconnectAll();
                this.isScanning = false;
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


    forceBonding(peripheral) {
        console.log('force bonding')
        return new Promise((resolve, reject) => {
            let serviceUuid = peripheral && peripheral.characteristics && peripheral.characteristics[0] && peripheral.characteristics[0].service ? peripheral.characteristics[0].service : false;
            let characteristicUuid = serviceUuid && peripheral.characteristics[0].characteristic ? peripheral.characteristics[0].characteristic : false;
            if (!serviceUuid || !characteristicUuid) {
                reject('no correct uuids found to execute force bonding');
            }
            this.ble.read(peripheral.id, serviceUuid, characteristicUuid).then(
                data => {
                    console.log('forcebonding', data);
                    resolve();
                },
                error => {
                    console.error('forceBonding', error)
                    reject();
                }
            ).catch(error => {
                console.error('forcebonding error', error)
                reject(error)
            })
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
                this.connectedDeviceId = null;
                console.error('disconnected from sleeve', deviceId);
            }
        )
    }

    bufferToHex(buffer: ArrayBuffer) {
        return Array.prototype.map.call(new Uint16Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
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