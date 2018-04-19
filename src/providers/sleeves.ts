import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';

import { BLE } from '@ionic-native/ble';

@Injectable()
export class Sleeves {
    data: any;
    localDb: any;
    devices: any[] = [];
    deviceName: string;
    deviceId: string;
    sleeveConnected: boolean;

    constructor(private ble: BLE) {
        this.localDb = new PouchDB('devices');
        this.deviceName = 'Philips Avent SCH820';
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
        if (device.name == this.deviceName) {
            console.error('found a sleeve!')
            // this.ble.stopScan();
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
                this.sleeveConnected = true;
                    successCallback();
                    console.error('Successfully connected to a sleeve')
                    
            },
            peripheral => {
                console.error('disconnected ');
            }
        )

    }

    bufferToHex(buffer: ArrayBuffer) {
        return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
      }

}
