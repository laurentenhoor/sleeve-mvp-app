import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { SleeveService } from './sleeve.service';
import { PairService } from './providers/pair.service';
import { PairModel } from './providers/pair.model';
import { ConnectService } from './providers/connect.service';
import { SyncService } from './providers/sync.service';
import { SyncModel } from './providers/sync.model';
import { RealtimeService } from './providers/realtime.service';

@NgModule({
    declarations: [
    ],
    imports: [
        IonicModule
    ],
    bootstrap: [],
    entryComponents: [
    ],
    providers: [
        PairService,
        PairModel,
        ConnectService,
        SleeveService,
        SyncService,
        SyncModel,
        RealtimeService
    ]
})
export class SleeveModule {};