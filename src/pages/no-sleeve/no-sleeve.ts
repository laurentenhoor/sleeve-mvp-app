import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Pairing } from '../pairing/pairing';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
    selector: 'no-sleeve',
    templateUrl: 'no-sleeve.html'
})
export class NoSleeve {

    constructor(
        private nav: NavController,
        private inAppBrowser: InAppBrowser,
    ) {

    }

    quickStart() {
        this.nav.push(Pairing, {}, { animation: 'md-transition' });
    }

    learnMore() {
        let url = 'https://www.youtube.com/watch?v=0l-gAVKMQ5c&feature=youtu.be';
        this.inAppBrowser.create(url, '_system')
    }

    closeModal() {
        this.nav.pop();
    }

}