
import { Component } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';

import { QuickStart } from '../quick-start/quick-start'
import { BrowserTab } from '@ionic-native/browser-tab';
import { Platform } from 'ionic-angular';

import { InAppBrowser } from '@ionic-native/in-app-browser';

import { Sleeves } from '../../providers/sleeves'

// import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
// import { BluetoothLE } from '@ionic-native/bluetooth-le';

@Component({
    selector: 'first-use',
    templateUrl: 'first-use.html'
})
export class FirstUse {

    constructor(
        private alertCtrl: AlertController,
        private nav: NavController,
        private browserTab: BrowserTab,
        private inAppBrowser: InAppBrowser,
        private platform: Platform,
        private sleevesService: Sleeves
    ) {

    }

    ionViewDidEnter() {

        this.sleevesService.scanAndConnect()
            .subscribe(connectedSleeve => {
                console.log('successfully connected to sleeve', connectedSleeve)
                this.nav.push(QuickStart);
            })

    }

    learnMore() {
        let url = 'https://www.youtube.com/watch?v=0l-gAVKMQ5c&feature=youtu.be';
        this.inAppBrowser.create(url, '_system')
    }

}
