import { Injectable, NgZone } from '@angular/core';
import { ModalController, Events, Platform } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';

import PouchDB from 'pouchdb';
import { Observable } from 'rxjs/Observable';
import { Feeds } from '../feeds';
import { PairModel } from './pair.model';
import { PairService } from './pair.service';
import { ConnectService } from './connect.service';
import { SyncService } from './sync.service';


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
    
    private connectedDeviceId: string;
    private sleeveConnected: boolean = false;    

    constructor(
        private ble: BLE,
        private pairService: PairService,
        private syncService: SyncService,
    ) { 
    }

    synchronizeFeeds() {
        return this.syncService.syncFeeds();
    }

    scanAndPair(): Promise<any> {
        return this.pairService.pair()
    }

    isBluetoothEnabled(): Promise<any> {
        return this.ble.isEnabled();
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

    private bufferToHex(buffer: ArrayBuffer) {
        return Array.prototype.map.call(new Uint16Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
    }

}