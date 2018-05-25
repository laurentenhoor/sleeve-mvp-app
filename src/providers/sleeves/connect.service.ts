import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import { PairModel } from './pair.model';

@Injectable()
export class ConnectService {
    private defaultSleeveName: string = 'Philips Avent SCH820';
    private connectedDeviceId: string;
    private sleeveConnected: boolean = false;

    constructor(
        private ble: BLE,
        private events: Events,
        private pairModel: PairModel
    ) {

    }

    disconnectAll(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.pairModel.pairedSleeves.length == 0) {
                resolve();
            }

            let disconnectionCounter = 0;

            this.pairModel.pairedSleeves.forEach((sleeve) => {
                this.ble.disconnect(sleeve._id).then(
                    success => {
                        console.log('disconnected', sleeve._id)
                        disconnectionCounter++;
                        if (disconnectionCounter == this.pairModel.pairedSleeves.length) {
                            resolve();
                        }
                    },
                    error => {
                        console.error('disconnect', error)
                        reject();
                    }
                )
            });
        })
    }

    async connect(deviceId:string): Promise<any> {
        if (this.sleeveConnected) {
            console.log('We allow only one connected device at a time.');
            await this.disconnectAll();
        }
        return this.ble.connect(deviceId).toPromise();
    }

}