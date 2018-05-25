import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { Sleeves } from './sleeves';
import { PairService } from './pair.service';
import { PairModel } from './pair.model';
import { ConnectService } from './connect.service';
import { SyncService } from './sync.service';

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
    ]
})
export class SleevesModule {}