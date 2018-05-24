
import { Component, NgZone } from '@angular/core';
import { AlertController, NavController, Events, App } from 'ionic-angular';

import { Sleeves } from '../../providers/sleeves/sleeves';
import { Connecting } from '../connecting/connecting';

import { ModalController } from 'ionic-angular';
import { UiSettings } from '../../providers/ui-settings';
import { Pairing } from '../pairing/pairing';
import { PairModel } from '../../providers/sleeves/pair.model';

@Component({
    selector: 'settings',
    templateUrl: 'settings.html'
})
export class Settings {
    private pairedSleeves: any;

    constructor(
        private alertCtrl: AlertController,
        private sleevesService: PairModel,
        public modalCtrl: ModalController,
        private events: Events,
        private uiSettings: UiSettings,
        private nav: NavController,
        private app: App
    ) {        
    }

    ionViewDidLoad() {
    }

    pair() {
        this.app.getRootNav().push(Pairing, {}, { animation: 'md-transition' })
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