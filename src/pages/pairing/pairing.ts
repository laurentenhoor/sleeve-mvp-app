
import { ViewChild, Component, NgZone } from '@angular/core';
import { AlertController, NavController, Slides, App, Events, ToastController, ModalController } from 'ionic-angular';

@Component({
    selector: 'pairing',
    templateUrl: 'pairing.html'
})
export class Pairing {

    @ViewChild(Slides) slides: Slides;

    constructor(
        private app: App,
        private nav: NavController,
        private zone: NgZone,
        private events: Events,
        private alertCtrl: AlertController,
        private toastCtrl: ToastController,
        private modalCtrl: ModalController
    ) {
    }

    ionViewDidLoad() {
        this.events.subscribe('sleeve-disconnected', () => {
            // do something if sleeve disconnects
        });
    }
    
    nextSlide() {
        this.slides.slideNext();
    }

}