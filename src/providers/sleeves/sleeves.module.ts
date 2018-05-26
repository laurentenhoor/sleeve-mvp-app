import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { Sleeves } from './sleeves';
import { PairService } from './pair.service';
import { PairModel } from './pair.model';
import { ConnectService } from './connect.service';
import { SyncService } from './sync.service';
import { SyncModel } from './sync.model';

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
        Sleeves,
        SyncService,
        SyncModel
    ]
})
export class SleevesModule {}