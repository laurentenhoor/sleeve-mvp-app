
import { ViewChild, Component} from '@angular/core';
import { AlertController, NavController, Slides } from 'ionic-angular';

import { Tabs } from '../tabs/tabs';
import { BLE } from '@ionic-native/ble';
import { Sleeves } from '../../providers/sleeves'

@Component({
    selector: 'quick-start',
    templateUrl: 'quick-start.html'
})
export class QuickStart {
    @ViewChild(Slides) slides: Slides;

    constructor(
        private nav: NavController,
        private ble: BLE,
        private sleevesService: Sleeves
    ) {

    }

    ionViewDidEnter() {

        this.sleevesService.state().subscribe(state => {
            console.log('received state from sleeve', state)
            this.slides.slideNext();
        })
     
    }

    finishInstallation() {
        this.nav.setRoot(Tabs)
    }

}
