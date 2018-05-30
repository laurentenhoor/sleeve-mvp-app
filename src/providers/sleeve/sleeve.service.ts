import { Injectable } from '@angular/core';
import { PairService } from './providers/pair.service';
import { RealtimeService } from './providers/realtime.service';
import { SyncService } from './providers/sync.service';
import { PairModel } from './providers/pair.model';
import { SyncModel } from './providers/sync.model';
import { Observable } from 'rxjs/Observable';

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
export class SleeveService {
    constructor(
        private pairModel: PairModel,
        private pairService: PairService,
        private syncService: SyncService,
        private realtimeService: RealtimeService,
        private syncModel: SyncModel
    ) {
    }

    pair(): Promise<any> {
        return this.pairService.pair();
    }

    syncFeeds(): Promise<any> {
        return this.syncService.syncFeeds();
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

    get pairedSleeves() {
        return this.pairModel.pairedSleeves;
    }

    amountOfPairedSleeves(): Promise<number> {
        return this.pairModel.amountOfPairedSleeves();
    }

    unpair(sleeve): void {
        return this.pairModel.removeSleeve(sleeve);
    }

    angle(): Observable<any> {
        return this.realtimeService.angle();
    }

    state(): Observable<any> {
        return this.realtimeService.state();
    }

}