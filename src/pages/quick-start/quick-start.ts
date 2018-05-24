
import { ViewChild, Component, NgZone } from '@angular/core';
import { AlertController, NavController, Slides, App, Events, ToastController, ModalController, ViewController } from 'ionic-angular';

import { BLE } from '@ionic-native/ble';
import { Sleeves, SleeveStates } from '../../providers/sleeves'
import { Connecting } from '../connecting/connecting';
import { TabsPage } from '../tabs/tabs';
import { Pairing } from '../pairing/pairing';

enum QsgStep {
    INTRODUCTION,
    REMOVE_CAP,
    PLACE_BOTTLE,
    WEIGH_BEFORE,
    FEEDING,
    WIGGLE,
    WEIGH_AFTER,
    SYNCHRHONIZE
}

@Component({
    selector: 'quick-start',
    templateUrl: 'quick-start.html'
})
export class QuickStart {

    @ViewChild(Slides) slides: Slides;

    private QsgStep: typeof QsgStep = QsgStep;

    private isMeasuringBefore: boolean = false;
    private hasMeasuredBefore: boolean = false;
    private isMeasuringAfter: boolean = false;
    private hasMeasuredAfter: boolean = false;
    private feedIsDetected: boolean = false;
    private wiggleIsDetected: boolean = false;
    private startWeighTimeoutError: boolean = false;
    private endWeighTimeoutError: boolean = false;
    private feedTimeoutError: boolean = false;

    constructor(
        private nav: NavController,
        private ble: BLE,
        private sleevesService: Sleeves,
        private zone: NgZone,
        private app: App,
        private events: Events,
        private alertCtrl: AlertController,
        private toastCtrl: ToastController,
        private modalCtrl: ModalController,
        private viewCtrl: ViewController
    ) {

    }

    ionViewDidLoad() {
        this.events.subscribe('sleeve-disconnected', () => {

        });

        this.sleevesService.state().subscribe(state => {
            switch (state) {
                case SleeveStates.DEVICE_FEEDING_EXPECTED:
                    if (!this.feedIsDetected && this.slides.getActiveIndex() != QsgStep.WEIGH_BEFORE) {
                        this.slides.slideTo(QsgStep.WEIGH_BEFORE);
                    }
                    this.duringStartWeighing();
                    break;
                case SleeveStates.DEVICE_WEIGHING_COMPLETED:
                    if (this.slides.getActiveIndex() <= QsgStep.WEIGH_BEFORE) {
                        this.afterStartWeighing();
                    }
                    break;
                case SleeveStates.DEVICE_FEEDING:
                    if (!this.feedIsDetected && this.slides.getActiveIndex() != QsgStep.FEEDING) {
                        this.slides.slideTo(QsgStep.FEEDING);
                    }
                    this.afterFeeding();
                    break;
                case SleeveStates.DEVICE_WIGGLING:
                    if (this.slides.getActiveIndex() == QsgStep.WIGGLE) {
                        this.afterWiggle();
                    }
                    break;
                case SleeveStates.BUTTON_PRESSED:
                    // Limitation firmware: close feeding can only be detected 
                    // by a button press after feeding state 
                    if (this.feedIsDetected && !this.hasMeasuredAfter) {
                        this.slides.slideTo(QsgStep.WEIGH_AFTER);
                        this.duringEndWeighing();
                    }
                    break;
                case SleeveStates.DEVICE_WEIGHING_TIMEOUT:
                    if (this.slides.getActiveIndex() <= QsgStep.WEIGH_BEFORE) {
                        this.showStartWeighError();
                    } else {
                        this.showEndWeighError();
                    }
                    break;
                case SleeveStates.DEVICE_FEEDING_END:
                    this.afterEndWeighing();
                    break;
                case SleeveStates.BLE_ADVERTISING:
                    this.nav.push(Pairing, {}, { animation: 'md-transition' });
                    break;
            }
        }, error => {
            console.error('no states available', error)
        })
    }

    nextSlide() {
        this.slides.slideNext();
        switch (this.slides.getActiveIndex()) {
            case QsgStep.FEEDING:
                this.duringFeeding();
                break;
        }
    }

    duringStartWeighing() {
        this.zone.run(() => {
            this.isMeasuringBefore = true;
            this.hasMeasuredBefore = false;
            this.startWeighTimeoutError = false;
        });
    }

    showStartWeighError() {
        this.zone.run(() => {
            this.startWeighTimeoutError = true;
        });
    }

    afterStartWeighing() {
        this.zone.run(() => {
            this.isMeasuringBefore = false;
            this.hasMeasuredBefore = true;
        });
    }

    duringFeeding() {
        this.zone.run(() => {
            setTimeout(() => {
                if (!this.feedIsDetected) {
                    this.feedTimeoutError = true;
                }
            }, 15 * 1000)
        })
    }

    afterFeeding() {
        this.zone.run(() => {
            this.feedIsDetected = true;
            this.feedTimeoutError = false;
        })
    }

    afterWiggle() {
        this.zone.run(() => {
            this.wiggleIsDetected = true;
        })
    }

    duringEndWeighing() {
        this.zone.run(() => {
            this.isMeasuringAfter = true;
            this.hasMeasuredAfter = false;
            this.endWeighTimeoutError = false;
        });
    }

    showEndWeighError() {
        this.zone.run(() => {
            this.endWeighTimeoutError = true;
        });
    }

    afterEndWeighing() {
        this.zone.run(() => {
            this.isMeasuringAfter = false;
            this.hasMeasuredAfter = true;
        });
    }

    gotoTimeline() {
        this.closeModal();
    }

    closeModal() {
        // this.nav.pop({ animation: 'md-transition' });
        // this.nav.popToRoot();
        // this.app.getRootNav().popToRoot();
        // this.nav.push(TabsPage)
        this.nav.setRoot(TabsPage, {}, { animate: true, direction: 'forward', animation: 'md-transition' });
    }

    showWeighErrorHints() {
        let alert = this.alertCtrl.create({
            title: 'Extra Tip!',
            subTitle: 'Do not touch the Smart Sleeve during the measurement. Make sure it is on a flat and hard surface.',
            buttons: ['OK']
        });
        alert.present();
    }

    showFeedErrorHints() {
        let alert = this.alertCtrl.create({
            title: 'Extra Tip!',
            subTitle: 'It will take a couple of seconds until the feed will be detected.',
            buttons: ['OK']
        });
        alert.present();
    }

    showDeviceActionToast() {
        let toast = this.toastCtrl.create({
            message: 'Please use your Smart Sleeve!',
            duration: 3000,
            position: 'bottom',
        });
        toast.present();
    }

}