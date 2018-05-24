import { Injectable } from '@angular/core';
import { BLE } from '@ionic-native/ble';
import { PairModel } from './pair.model';
import { Events } from 'ionic-angular';
import { ConnectService } from './connect.service';

@Injectable()
export class PairService {
    private defaultSleeveName: string = 'Philips Avent SCH820';
    private connectedDeviceId: string;
    private sleeveConnected: boolean = false;

    constructor(
        private ble: BLE,
        private pairModel: PairModel,
        private events: Events,
        private connectService: ConnectService,
    ) {
        
    }

    async pair(retryResolve?, retryReject?): Promise<any> {
        await this.connectService.disconnectAll();

        return new Promise((resolve, reject) => {
            if (!retryResolve) {
                retryResolve = resolve;
                retryReject = reject;
            }
            this.initScan((connectedSleeve) => {
                console.log('Starting Forced Bonding', connectedSleeve)
                this.forceBonding()
                    .then(() => {
                        retryResolve(connectedSleeve);
                    })
                    .catch((error) => {
                        console.error('Forcebonding error: ', JSON.stringify(error))
                        return this.pair(resolve, reject);
                    });
            })
        })
    }

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
            this.connectService.connect(device.id, successCallback);
        }
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

    

}