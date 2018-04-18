import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';

import { BLE } from '@ionic-native/ble';

@Injectable()
export class Devices {
    data: any;
    localDb: any;
    devices: any[] = [];
    deviceId: string;
    sleeveFound: boolean;

    constructor(private ble: BLE) {
        // this.localDb = new PouchDB('devices');
        // this.deviceId = 'D7832B16-8B21-4BCB-906C-0B6779BB18D8';
        // this.sleeveFound = false;
        // console.log('new Devices()')
    }

    isSleeveFound() {
        return this.sleeveFound;
    }

    scan() {
        this.devices = [];  // clear list

        this.ble.scan([], 5).subscribe(
            device => this.onDeviceDiscovered(device),
            error => console.error('scan error', error)
        );
    }

    onDeviceDiscovered(device) {
        console.log('discovered', device)
        if (device.id == this.deviceId) {
            this.sleeveFound = true;
        }
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.ble.connect(this.deviceId).subscribe(
                peripheral => {
                    resolve(peripheral)
                    this.ble.startNotification('D7832B16-8B21-4BCB-906C-0B6779BB18D8',
                        '000030F3-0000-1000-8000-00805F9B34FB',
                        '000063EC-0000-1000-8000-00805F9B34FB'
                    ).subscribe(data => {
                        console.log('reseived data ', data)
                    }, error => {
                        console.error(error)
                    })
                },
                peripheral => {
                    reject('disconnected');
                    console.error('disconnected ');
                }
            )

        })

    }

}
