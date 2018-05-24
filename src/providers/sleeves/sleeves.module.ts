import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { ComManager } from './com-manager';
import { PairManager } from './pair-manager';
import { Sleeves } from './sleeves';

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
        ComManager,
        PairManager,
        Sleeves,
    ]
})
export class SleevesModule {}