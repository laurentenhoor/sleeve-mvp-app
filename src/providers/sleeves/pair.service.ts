import { Injectable } from '@angular/core';
import { BLE } from '@ionic-native/ble';
import { ConnectService } from './connect.service';
import { PairModel } from './pair.model';

@Injectable()
export class PairService {
    isPairing: boolean = false;
    private DEFAULT_SLEEVE_NAME: string = 'Philips Avent SCH820';

    constructor(
        private ble: BLE,
        private connectService: ConnectService,
        private pairModel: PairModel,
    ) {

    }

    pair(): Promise<any> {
        return this.pairWithRetryMechanism();
    }

    private pairWithRetryMechanism(retryResolve?, retryReject?): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!retryResolve) {
                retryResolve = resolve;
                retryReject = reject;
            }
            this.isPairing = true;

            this.scanUntilFirstFoundSleeve().then((foundSleeve) => {
                return this.connectService.connect(foundSleeve.id);

            }).then((connectedSleeve) => {
                return this.forceBonding(connectedSleeve.id)

            }).then((bondedSleeve) => {
                this.isPairing = false;
                this.pairModel.storePairedSleeveId(bondedSleeve.id)
                retryResolve(bondedSleeve);

            }).catch((error) => {
                this.handlePairingErrors(error).then(
                    (retry) => this.pairWithRetryMechanism(resolve, reject),
                    (stop) => {
                        retryReject()
                        this.isPairing = false;
                    }
                );
            })

        })
    }

    private handlePairingErrors(error: string) {
        console.log('Pairing error:', error)
        return new Promise((resolve, reject) => {
            switch (error) {
                case 'cordova_not_available':
                    reject('stop retrying pairing');
                    break;
                default:
                    resolve('continue retrying pairing');
                    break;
            }
        })
    }

    private async scanUntilFirstFoundSleeve(): Promise<any> {
        await this.connectService.disconnectAll();
        await this.ble.stopScan();

        return new Promise((resolve, reject) => {
            this.ble.startScan([]).subscribe(
                peripheral => {
                    if (this.isAPhilipsSleeve(peripheral.name)) {
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
        return deviceName == this.DEFAULT_SLEEVE_NAME;
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