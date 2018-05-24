
import { Component, NgZone } from '@angular/core';
import { AlertController, NavController, ModalController } from 'ionic-angular';
import { Sleeves } from '../../providers/sleeves';
import { Pairing } from '../pairing/pairing';
import { Connecting } from '../connecting/connecting';

@Component({
    selector: 'no-sleeve',
    templateUrl: 'no-sleeve.html'
})
export class NoSleeve {

    constructor(
        private nav: NavController,
        public modalCtrl: ModalController,
        private alertCtrl: AlertController,
        private zone: NgZone
    ) {
    }

    ionViewDidLoad() {
    }

    ionViewDidEnter() {
    }

    quickStart() {
        console.log('quickStart()')
        // this.nav.pop();
        // this.modalCtrl.create(Pairing).present();
        this.nav.push(Pairing, {}, { animation: 'md-transition' });
    }

    buySleeve() {

    }

    closeModal() {
        this.nav.pop();
    }

}