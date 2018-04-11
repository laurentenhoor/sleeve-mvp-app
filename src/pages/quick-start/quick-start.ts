
import { Component } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';

import {Tabs} from '../tabs/tabs'

@Component({
    selector: 'quick-start',
    templateUrl: 'quick-start.html'
})
export class QuickStart {

    constructor(
        private nav: NavController
    ) {

    }

    finishInstallation() {
        this.nav.setRoot(Tabs)
    }

}
