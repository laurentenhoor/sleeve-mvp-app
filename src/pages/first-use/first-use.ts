
import { Component } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';

import { QuickStart } from '../quick-start/quick-start'
import { BrowserTab } from '@ionic-native/browser-tab';
import { Platform } from 'ionic-angular';

import { InAppBrowser } from '@ionic-native/in-app-browser';

// import { Devices } from '../../providers/devices'

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
    ) {

    }

    ionViewDidEnter() {
    }

    learnMore() {
        let url = 'https://www.youtube.com/watch?v=0l-gAVKMQ5c&feature=youtu.be';
        this.inAppBrowser.create(url, '_system')
    }
    quickStart() {

        this.nav.push(QuickStart);

        // let alert = this.alertCtrl.create({
        //     title: 'Installation',
        //     subTitle: 'This will start the quick start guide.',
        //     buttons: ['Dismiss']
        //   });
        //   alert.present();

    }


}
