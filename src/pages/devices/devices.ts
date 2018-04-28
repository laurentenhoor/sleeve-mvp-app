
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
    private pairedSleeves: any;

    constructor(
        private alertCtrl: AlertController,
        private nav: NavController,
        private sleevesService: Sleeves,
        public modalCtrl: ModalController
    ) {
        
        this.pairedSleeves = this.sleevesService.getPairedSleeves()
        
    }

    ionViewDidEnter() {
    }

    pair() {
        this.modalCtrl.create(Connecting).present();
    }

    removeSleeve(sleeve) {
        let alert = this.alertCtrl.create({
            title: 'Unpair device',
            message: 'Do you want to unpair ' + sleeve._id + '?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Unpair',
                    handler: () => {
                        console.log('Unpair clicked');
                        this.sleevesService.removeSleeve(sleeve)
                    }
                }
            ]
        });
        alert.present();

    }

}