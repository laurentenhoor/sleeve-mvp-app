
import { Component } from '@angular/core';
import { AlertController, NavController, Events, App } from 'ionic-angular';

import { SleeveService } from '../../providers/sleeve/sleeve.service';
import { Connecting } from '../connecting/connecting';

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
        private sleeveService: SleeveService,
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

    setQsg(isDefault) {
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
                        this.sleeveService.unpair(sleeve)
                    }
                }
            ]
        });
        alert.present();

    }

}