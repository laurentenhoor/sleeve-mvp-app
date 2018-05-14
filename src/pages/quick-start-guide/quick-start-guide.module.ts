import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { RemoveCap } from './remove-cap/remove-cap';
import { InsertBottle } from './insert-bottle/insert-bottle';
import { Feeding } from './feeding/feeding';
import { Wiggle } from './wiggle/wiggle';
import { Synchronize } from './synchronize/synchronize';
import { WeighingStart } from './weighing-start/weighing-start';
import { WeighingEnd } from './weighing-end/weighing-end';
import { QuickStartGuide } from './quick-start-guide';

@NgModule({
    declarations: [
        RemoveCap,
        InsertBottle,
        WeighingStart,
        Feeding,
        Wiggle,
        WeighingEnd,
        Synchronize,
        QuickStartGuide,
    ],
    imports: [
        IonicModule
    ],
    bootstrap: [],
    entryComponents: [
        RemoveCap,
        InsertBottle,
        WeighingStart,
        Feeding,
        Wiggle,
        WeighingEnd,
        Synchronize,
        QuickStartGuide,
    ],
    providers: [
    ]
})
export class QuickStartGuideModule {}