
import { ViewChild, Component} from '@angular/core';
import { AlertController, NavController, Slides } from 'ionic-angular';

import { Tabs } from '../tabs/tabs';
import { BLE } from '@ionic-native/ble';
// import { Devices } from '../../providers/devices'

@Component({
    selector: 'quick-start',
    templateUrl: 'quick-start.html'
})
export class QuickStart {
    @ViewChild(Slides) slides: Slides;

    constructor(
        private nav: NavController,
        private ble: BLE
    ) {

        this.ble.startNotification('D7832B16-8B21-4BCB-906C-0B6779BB18D8',
            '000030f3-0000-1000-8000-00805f9b34fb',
            '000063eC-0000-1000-8000-00805f9b34fb'
        ).subscribe(data => {
            console.log(this.bufferToHex(data));
            this.slides.slideNext();
        }, error => {
            console.error(error);
        })
    }

    ionViewDidEnter() {
     
    }

    finishInstallation() {
        this.nav.setRoot(Tabs)
    }

    bufferToHex(buffer: ArrayBuffer) {
        return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
    }

}
