
import { ViewChild, Component} from '@angular/core';
import { AlertController, NavController, Slides } from 'ionic-angular';

import { BLE } from '@ionic-native/ble';
import { Sleeves } from '../../providers/sleeves'
import { Tabs } from '../tabs/tabs'

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
            console.log('Received state from sleeve:', state)
            this.slides.slideNext();
        }, error => {
            console.error('no states available', error)
        })
        this.sleevesService.feedData().then(feedData=>{
            console.log('feeddata from QSG')
            this.nav.setRoot(Tabs);
        })
    }

    closeModal() {
        this.sleevesService.disconnectAll();
        this.nav.pop();
    }

    finishInstallation() {
        this.nav.pop();
    }

}