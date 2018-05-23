
import { Component, NgZone } from '@angular/core';
import { AlertController, NavController, Events } from 'ionic-angular';

import { Sleeves } from '../../providers/sleeves';
import { Connecting } from '../connecting/connecting';

import { ModalController } from 'ionic-angular';
import { UiSettings } from '../../providers/ui-settings';
import { Pairing } from '../pairing/pairing';

@Component({
    selector: 'settings',
    templateUrl: 'settings.html'
})
export class Settings {
    private pairedSleeves: any;

    constructor(
        private alertCtrl: AlertController,
        private sleevesService: Sleeves,
        public modalCtrl: ModalController,
        private events: Events,
        private uiSettings: UiSettings
    ) {        
    }

    ionViewDidLoad() {
    }

    pair() {
        // this.modalCtrl.create(Connecting).present();
        this.modalCtrl.create(Pairing).present();
    }

    setQsg(isDefault){
        this.uiSettings.defaultQsg = isDefault;
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