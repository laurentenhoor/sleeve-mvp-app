import { Injectable } from '@angular/core';
import { PairService } from './pair.service';
import { RealtimeService } from './realtime.service';
import { SyncService } from './sync.service';
import { PairModel } from './pair.model';
import { Observable } from 'rxjs/Observable';
import { SyncModel } from './sync.model';

export enum SleeveStates {
    DEVICE_STATE_NONE = 0, //Don't add anything before this
    BLE_ADVERTISING = 1,
    BLE_PAIRED_AND_BONDED = 2,
    DEVICE_FEEDING_EXPECTED = 3,
    DEVICE_FEEDING = 4,
    DEVICE_FEEDING_PAUSED = 5,
    DEVICE_FEEDING_END = 6,
    DEVICE_RESET = 7,
    BLE_DISCONNECTED = 8,
    DEVICE_WEIGHING_COMPLETED = 9,
    DEVICE_VERTICAL_STABLE = 10,
    DEVICE_WIGGLING = 11,
    BUTTON_PRESSED = 12,
    DEVICE_WEIGHING_TIMEOUT = 13,
    VERTICAL_STABLE = 14,
    DEVICE_STATE_LAST = 15 //increment this number and all states before this
}

@Injectable()
export class Sleeves {
    constructor(
        private pairModel: PairModel,
        private pairService: PairService,
        private syncService: SyncService,
        private realtimeService: RealtimeService,
        private syncModel: SyncModel
    ) {
    }

    get isSyncing(): boolean {
        return this.syncService.isSyncing;
    }

    get isPairing(): boolean {
        return this.pairService.isPairing;
    }

    get lastSyncTimestamp(): number {
        return this.syncModel.lastSyncTimestamp;
    }

    amountOfPairedSleeves(): Promise<number> {
        return this.pairModel.amountOfPairedSleeves();
    }

    syncFeeds(): Promise<any> {
        return this.syncService.syncFeeds();
    }

    scanAndPair(): Promise<any> {
        return this.pairService.pair()
    }

    angle(): Observable<any> {
        return this.realtimeService.angle();
    }

    state(): Observable<any> {
        return this.realtimeService.state();
    }

}