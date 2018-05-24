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
                this.events.publish('sleeve-disconnected');
            }
        )
    }

}