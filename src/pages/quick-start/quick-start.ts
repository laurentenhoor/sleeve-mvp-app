
import { ViewChild, Component, NgZone } from '@angular/core';
import { AlertController, NavController, Slides, App, Events, ToastController } from 'ionic-angular';

import { BLE } from '@ionic-native/ble';
import { Sleeves, SleeveStates } from '../../providers/sleeves'

enum QsgStep {
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

    constructor(
        private nav: NavController,
        private ble: BLE,
        private sleevesService: Sleeves,
        private zone: NgZone,
        private app: App,
        private events: Events,
        private alertCtrl: AlertController,
        private toastCtrl: ToastController,
    ) {

    }

    ionViewDidLoad() {
        this.sleevesService.state().subscribe(state => {
            switch (state) {
                case SleeveStates.DEVICE_FEEDING_EXPECTED:
                    if (this.slides.getActiveIndex() != QsgStep.WEIGH_BEFORE) {
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
                    if (this.slides.getActiveIndex() != QsgStep.FEEDING) {
                        this.slides.slideTo(QsgStep.FEEDING);
                    }
                    this.afterFeeding();
                    break;
                case SleeveStates.DEVICE_WIGGLING:
                    this.afterWiggle();
                    break;
                case SleeveStates.BUTTON_PRESSED:
                    if (this.slides.getActiveIndex() >= QsgStep.WEIGH_BEFORE) {
                        this.duringEndWeighing();
                    }
                    break;
                case SleeveStates.DEVICE_WEIGHING_TIMEOUT:
                    if (this.slides.getActiveIndex() == QsgStep.WEIGH_BEFORE) {
                        this.showStartWeighError();
                    } else {
                        this.showEndWeighError();
                    }
                    break;
                case SleeveStates.DEVICE_FEEDING_END:
                    this.afterEndWeighing();
                    break;
            }
        }, error => {
            console.error('no states available', error)
        })
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

    afterFeeding() {
        this.zone.run(() => {
            this.feedIsDetected = true;
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
        this.events.publish('synchronize-feeds');
        this.nav.pop();
    }

    showWeighErrorHints() {
        let alert = this.alertCtrl.create({
            title: 'Extra Tip!',
            subTitle: 'Do not touch the device during the measurement. Make sure it is on a flat and hard surface.',
            buttons: ['OK']
        });
        alert.present();
    }

    showDeviceActionToast() {
        let toast = this.toastCtrl.create({
            message: 'Please Use Your Sleeve!',
            duration: 3000,
            position: 'top',
        });
        toast.present();
    }

}