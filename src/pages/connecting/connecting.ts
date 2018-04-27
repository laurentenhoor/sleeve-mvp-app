
import { Component } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { Sleeves } from '../../providers/sleeves';
import { QuickStart } from '../quick-start/quick-start';

import { ModalController } from 'ionic-angular';

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
        public modalCtrl: ModalController
    ) {

    }

    ionViewDidEnter() {
        this.sleevesService.scanAndConnect()
            .subscribe(connectedSleeve => {
                console.log('Successfully connected to sleeve', connectedSleeve)
                this.nav.pop();
                this.modalCtrl.create(QuickStart).present();
            }, error => {
                console.error(error);
            })
    }

    demo() {
        this.nav.pop();
        this.modalCtrl.create(QuickStart).present();
        this.sleevesService.storeSleeve('laurenSleeve');
    }

    learnMore() {
        let url = 'https://www.youtube.com/watch?v=0l-gAVKMQ5c&feature=youtu.be';
        this.inAppBrowser.create(url, '_system')
    }


    closeModal() {
        this.nav.pop();
    }


}