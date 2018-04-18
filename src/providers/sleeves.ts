import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';

import { BLE } from '@ionic-native/ble';

@Injectable()
export class Sleeves {
    data: any;
    localDb: any;
    devices: any[] = [];
    deviceId: string;
    sleeveConnected: boolean;

    constructor(private ble: BLE) {
        this.localDb = new PouchDB('devices');
        this.deviceId = 'D7832B16-8B21-4BCB-906C-0B6779BB18D8';
        this.sleeveConnected = false;
    }

    isConnected() {
        return this.sleeveConnected;
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
        if (device.id == this.deviceId) {
            console.error('found a sleeve!')

            // this.ble.stopScan();

            this.connect(successCallback);
        }
    }

    connect(successCallback) {
        this.ble.connect(this.deviceId).subscribe(
            peripheral => {
                this.sleeveConnected = true;
                successCallback();
                console.error('Successfully connected to a sleeve')
                this.ble.startNotification('D7832B16-8B21-4BCB-906C-0B6779BB18D8',
                    '000030F3-0000-1000-8000-00805F9B34FB',
                    '000063EC-0000-1000-8000-00805F9B34FB'
                ).subscribe(data => {
                    console.log(data)
                }, error => {
                    console.error(error)
                })
            },
            peripheral => {
                console.error('disconnected ');
            }
        )

    }

}
