import { Injectable } from '@angular/core';
import { BLE } from '@ionic-native/ble';
import { PairManager } from './pair-manager';

@Injectable()
export class ComManager {

    constructor(
        private ble: BLE,
        private pairManager: PairManager
    ) {

    }

    async pair(): Promise<any> {

        await this.pairManager.disconnectAll();

        return new Promise((resolve, reject) => {

            let pairedSleeve = null;

            resolve(pairedSleeve)

        })
    }

    async stopAll(): Promise<any> {
        await this.ble.stopScan();
        await this.pairManager.disconnectAll();
    }


}