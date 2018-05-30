import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import { PairModel } from './pair.model';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ConnectService {
    connectedDeviceId: string;
    private defaultSleeveName: string = 'Philips Avent SCH820';

    constructor(
        private ble: BLE,
        private events: Events,
        private pairModel: PairModel
    ) {

    }

    async connect(device): Promise<any> {
        await this.disconnect();

        return new Promise((resolve, reject) => {
            this.ble.connect(device.id).subscribe(
                connectedDevice => {
                    this.connectedDeviceId = connectedDevice.id;
                    resolve(connectedDevice);
                },
                disconnectedDevice => {
                    console.error('sleeve disconnected:', disconnectedDevice.id);;
                    this.events.publish('sleeve-disconnected', disconnectedDevice);
                }
            );
        })
    }

    disconnect() {
        if (!this.connectedDeviceId) {
            return;
        }
        return this.ble.disconnect(this.connectedDeviceId).then(() => {
            this.connectedDeviceId = null;
        })
    }

}