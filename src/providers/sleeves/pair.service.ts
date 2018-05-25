import { Injectable } from '@angular/core';
import { BLE } from '@ionic-native/ble';
import { PairModel } from './pair.model';
import { Events } from 'ionic-angular';
import { ConnectService } from './connect.service';
import { ThrowStmt } from '@angular/compiler';

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

    pair(): Promise<any> {
        return this.pairWithRetryMechanism();
    }

    private async pairWithRetryMechanism(retryResolve?): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!retryResolve) {
                retryResolve = resolve;
            }
            this.scanUntilFirstFoundSleeve().then((foundSleeve) => {
                return this.connectService.connect(foundSleeve.id);
            }).then((connectedSleeve) => {
                return this.forceBonding(connectedSleeve.id)
            }).then((bondedSleeve) => {
                retryResolve(bondedSleeve);
            }).catch((error) => {
                console.error(error);
                this.pairWithRetryMechanism(resolve);
            })

        })
    }

    private async scanUntilFirstFoundSleeve(): Promise<any> {
        await this.connectService.disconnectAll();
        await this.ble.stopScan();

        return new Promise((resolve, reject) => {
            this.ble.startScan([]).subscribe(
                peripheral => {
                    if (this.isAPhilipsSleeve(peripheral)) {
                        this.ble.stopScan();
                        resolve(peripheral)
                    }
                },
                error => {
                    console.error('scan error', error);
                    reject(error);
                }
            );
        });
    }

    private isAPhilipsSleeve(deviceName: string): boolean {
        return deviceName == this.defaultSleeveName
    }

    private forceBonding(deviceId: string): Promise<any> {
        console.log('Force bonding by reading the state characteristic')
        return new Promise((resolve, reject) => {
            this.ble.read(deviceId,
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