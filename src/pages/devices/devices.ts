
import { Component } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';

import { Sleeves } from '../../providers/sleeves';
import { Connecting } from '../connecting/connecting';

import { ModalController } from 'ionic-angular';


@Component({
    selector: 'devices',
    templateUrl: 'devices.html'
})
export class Devices {

    constructor(
        private alertCtrl: AlertController,
        private nav: NavController,
        private sleevesService: Sleeves,
        public modalCtrl: ModalController
    ) {

    }

    ionViewDidEnter() {
    }

    pair() {
        this.modalCtrl.create(Connecting).present();
    }

}