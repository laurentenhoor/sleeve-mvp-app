
import { Component } from '@angular/core';
import { AlertController, NavController, App, Events } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { Sleeves } from '../../providers/sleeves';
import { QuickStart } from '../quick-start/quick-start';

import { ModalController } from 'ionic-angular';
import { UiSettings } from '../../providers/ui-settings';

// import { QuickStartGuide } from '../quick-start-guide/quick-start-guide';
import { Qsg } from '../qsg/qsg';
import { QuickStartGuide } from '../quick-start-guide/quick-start-guide';

@Component({
    selector: 'connecting',
    templateUrl: 'connecting.html'
})
export class Connecting {

    constructor(
        private alertCtrl: AlertController,
        private nav: NavController,
        private inAppBrowser: InAppBrowser,
        private sleevesService: Sleeves,
        public modalCtrl: ModalController,
        public appCtrl: App,
        public events: Events,
        private uiSettings: UiSettings
    ) {

    }
    ionViewDidEnter() {
        this.sleevesService.scanAndConnect()
            .then(connectedSleeve => {
                console.log('Successfully connected to a sleeve', connectedSleeve)
                this.openQsg();
            }, error => {
                console.error(error);
            }).catch(error => console.error('serious error'))
    }

    openQsg() {
        this.nav.pop();
        if (this.uiSettings.defaultQsg) {
            this.modalCtrl.create(QuickStart).present();
        } else {
            this.modalCtrl.create(Qsg).present();
        }
    }

    demo() {
        // this.openQsg();
    }

    checkBluetooth() {
        this.sleevesService.isBluetoothEnabled()
            .then(() => {
                this.alertCtrl.create({
                    title: 'Bluetooth is ON',
                    subTitle: 'Please go ahead',
                    buttons: ['Dismiss']
                }).present()
            }).catch(() => {
                this.alertCtrl.create({
                    title: 'Please turn on Bluetooth',
                    subTitle: 'You need it in the next steps',
                    buttons: ['Dismiss']
                }).present()
            })
    }

    learnMore() {
        let url = 'https://www.youtube.com/watch?v=0l-gAVKMQ5c&feature=youtu.be';
        this.inAppBrowser.create(url, '_system')
    }

    closeModal() {
        this.nav.pop();
    }


}