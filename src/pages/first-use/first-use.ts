
import { Component } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';

import {QuickStart} from '../quick-start/quick-start'

@Component({
    selector: 'first-use',
    templateUrl: 'first-use.html'
})
export class FirstUse {

    constructor(
        private alertCtrl: AlertController,
        private nav: NavController
    ) {
        
    }

    learnMore() {
        window.open('https://www.youtube.com/watch?v=0l-gAVKMQ5c&feature=youtu.be', '_system');
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
