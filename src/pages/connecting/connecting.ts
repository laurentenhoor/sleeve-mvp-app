
import { Component } from '@angular/core';
import { AlertController, NavController, App } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { Sleeves } from '../../providers/sleeves';
import { QuickStart } from '../quick-start/quick-start';

import { ModalController } from 'ionic-angular';
import { QuickStartGuide } from '../quick-start-guide/quick-start-guide';
import { Qsg } from '../qsg/qsg';

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
        public appCtrl: App
    ) {

    }

    ionViewDidEnter() {
        this.sleevesService.scanAndConnect()
            .subscribe(connectedSleeve => {
                console.log('Successfully connected to a sleeve', connectedSleeve)
                this.sleevesService.storeSleeve(connectedSleeve);
                this.openQsg();
            }, error => {
                console.error(error);
            })
    }

    openQsg() {
        this.nav.pop();
        this.appCtrl.getRootNav().push(QuickStartGuide);
        // this.modalCtrl.create(Qsg).present();
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

    generateUuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    learnMore() {
        let url = 'https://www.youtube.com/watch?v=0l-gAVKMQ5c&feature=youtu.be';
        this.inAppBrowser.create(url, '_system')
    }

    closeModal() {
        this.nav.pop();
    }


}