import { Injectable, NgZone } from '@angular/core';
import { BLE } from '@ionic-native/ble';
import { ConnectService } from './connect.service';
import { PairModel } from './pair.model';
import { PairService } from './pair.service';
import { Feeds } from '../feeds';
import { SyncModel } from './sync.model';

@Injectable()
export class SyncService {
    isSyncing: boolean = false;
    lastSyncTimestamp: number = 0;

    private dataBuffer: string = "";
    private syncTimestampDb: any;

    constructor(
        private ble: BLE,
        private connectService: ConnectService,
        private pairModel: PairModel,
        private pairService: PairService,
        private feedsService: Feeds,
        private zone: NgZone,
        private syncModel: SyncModel
    ) {
    }

    async syncFeeds(): Promise<any> {
        await this.connectService.disconnectAll();

        this.isSyncing = true;
        let self = this;

        // removed a check if a device is already connected: to be tested if this is ok

        console.log('trying to connect and sync')
        return new Promise((resolve, reject) => {
            let uuids = this.pairModel.pairedSleeves.map(item => { return item._id })
            // console.log('paired uuids to scan', uuids)
            if (!uuids || uuids.length == 0) {
                return reject('no paired devices')
            }
            console.log('scanning for following ids', uuids)

            let timeout = 10;
            setTimeout(() => {
                if (!this.pairService.isPairing) {
                    this.isSyncing = false
                    this.connectService.disconnectAll();
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
                            this.connectService.connect(peripheral.id)
                                .then((device) => {
                                    // console.log('connected to a sleeve')
                                    self.feedData(device.id).then(feedData => {
                                        this.isSyncing = false;
                                        resolve(feedData)
                                    })
                                }).catch(error => {
                                    console.error(error)
                                })
                        }
                    })
                }, scanError => {
                    this.isSyncing = false;
                    reject('unable to scan: ' + scanError)
                })

        })

    }


    private feedData(deviceId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log('subscribeToFeedData', deviceId)

            this.ble.startNotification(deviceId,
                '000030F0-0000-1000-8000-00805F9B34FB',
                '000063E7-0000-1000-8000-00805F9B34FB'
            ).subscribe(data => {
                if (this.handleData(data)) {
                    console.log('successfully consolidated a JSON:', this.dataBuffer)
                    this.feedsService.createFeedFromSleeve(this.dataBuffer);
                    this.syncModel.storeSyncTimestamp();
                    resolve(this.dataBuffer);
                    this.dataBuffer = "";
                    this.isSyncing = false;
                    this.connectService.disconnectAll();
                }
            }, error => {
                console.error('error while receiving feedData', error)
                reject('unable to receive feedData');
                this.connectService.disconnectAll();
                this.isSyncing = false;
            })
            this.sendDownloadFeedRequest(deviceId);
        })
    }

    private sendDownloadFeedRequest(deviceId: string) {
        this.ble.write(deviceId,
            '000030F0-0000-1000-8000-00805F9B34FB',
            '000063E7-0000-1000-8000-00805F9B34FB',
            this.stringToBytes('shrey')
        ).then(data => {
            console.log('successfully written the feed-download-request')
        }).catch(error => {
            console.error('error during writing the feed-download-request')
        })
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

    // ASCII only
    private bytesToString(buffer) {
        return String.fromCharCode.apply(null, new Uint8Array(buffer));
    }

    // ASCII only
    private stringToBytes(string) {
        let array = new Uint8Array(string.length);
        for (let i = 0, l = string.length; i < l; i++) {
            array[i] = string.charCodeAt(i);
        }
        return array.buffer;
    }

}