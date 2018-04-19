
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
        
        this.ble.startNotification(this.sleevesService.deviceId,
            '000030f3-0000-1000-8000-00805f9b34fb',
            '000063eC-0000-1000-8000-00805f9b34fb'
          ).subscribe(data => {
            console.log(this.bufferToHex(data));
            this.slides.slideNext();
          }, error => {
            console.error(error)
          })  
     
    }

    finishInstallation() {
        this.nav.setRoot(Tabs)
    }

    bufferToHex(buffer: ArrayBuffer) {
        return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
    }

}
