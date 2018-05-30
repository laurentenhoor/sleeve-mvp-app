
import { ViewChild, Component, NgZone } from '@angular/core';
import { AlertController, NavController, Slides, App, Events, ToastController, ModalController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';

import { SleeveService, SleeveStates } from '../../providers/sleeve/sleeve.service';
import { UiSettings } from '../../providers/ui-settings';

import { QuickStartSlides } from '../quick-start-slides/quick-start-slides';
import { QuickStartList } from '../quick-start-list/quick-start-list';
import { Settings } from '../settings/settings';
import { TabsPage } from '../tabs/tabs';

enum PairStep {
    CONSENT,
    PAIRING
}

@Component({
    selector: 'pairing',
    templateUrl: 'pairing.html'
})
export class Pairing {

    @ViewChild(Slides) slides: Slides;
    private PairStep: typeof PairStep = PairStep;
    private pairingTimeoutError: boolean = false;
    private bluetoothActivatedError: boolean = false;
    private hasPaired: boolean = false;
    private hasConsent: boolean = false;

    constructor(
        private app: App,
        private nav: NavController,
        private zone: NgZone,
        private events: Events,
        private alertCtrl: AlertController,
        private toastCtrl: ToastController,
        private modalCtrl: ModalController,
        private sleeveService: SleeveService,
        private uiSettings: UiSettings,
        private ble: BLE
    ) {


    }

    ionViewDidLoad() {
        this.events.subscribe('sleeve-disconnected', () => {
            if (this.slides.getActiveIndex() == PairStep.PAIRING) {
                this.alertCtrl.create({
                    title: 'Uh oh! Your Smart Sleeve disconnected.',
                    subTitle: "Please try again one more time.",
                    buttons: ['Discard']
                }).present();
                this.nav.push(Pairing, {}, { animation: 'md-transition' });
            }
        });

        setInterval(() => {
            this.checkBluetooth();
        }, 500);
    }

    ionViewDidEnter() {

    }

    openQsg() {
        // this.closeModal();
        if (this.uiSettings.defaultQsg) {
            this.nav.push(QuickStartSlides, {}, { animation: 'md-transition' })
            // this.modalCtrl.create(QuickStart).present();
        } else {
            this.nav.push(QuickStartList, {}, { animation: 'md-transition' })
            // this.modalCtrl.create(Qsg).present();
        }
    }

    nextSlide() {
        console.log('nextSlide();')
        switch (this.slides.getActiveIndex()) {
            case PairStep.PAIRING:
                this.openQsg();
                break;
            case PairStep.CONSENT:
                if (this.hasConsent) {
                    this.startBlePairing();
                    this.slides.slideNext();
                }
                break;
        }
    }

    listenToStates() {
        // duplicate code with quick-start.ts
        this.sleeveService.state().subscribe((state) => {
            if (state == SleeveStates.BLE_ADVERTISING) {
                this.nav.push(Pairing, {}, { animation: 'md-transition' });
                this.alertCtrl.create({
                    title: 'Uh oh! You did a long press.',
                    subTitle: "A long press is only used for pairing the Smart Sleeve. No problem, let's start over again.",
                    buttons: ['Discard']
                }).present();
            }
        })
    }

    startBlePairing() {
        console.log('Start BLE Scanning')
        this.sleeveService.scanAndPair()
            .then(pairedSleeve => {
                console.log('Successfully paired with sleeve', pairedSleeve.id)
                this.listenToStates();
                this.zone.run(() => {
                    this.hasPaired = true;
                })
            })
            .catch(error => {
                console.error('BlePairing reject', error)
            })
    }

    closeModal() {
        this.nav.pop({ animation: 'md-transition' });
        // this.nav.setRoot(TabsPage, {}, {animate: true, direction: 'forward', animation:'md-transition'});
    }

    checkBluetooth() {
        this.ble.isEnabled().then(() => {
            if (this.bluetoothActivatedError) {
                console.log('Bluetooth has been turned ON.')
                this.startBlePairing();
                this.bluetoothActivatedError = false;
            }
        }).catch(() => {
            this.bluetoothActivatedError = true;
        })
    }

    showPairingErrorHints() {
        console.log('todo implement pairing error hints')
    }

    showBluetoothErrorHints() {
        console.log('todo implement pairing error hints')
    }

    showDeviceActionToast() {
        let toast = this.toastCtrl.create({
            message: 'Please use your Smart Sleeve',
            duration: 3000,
            position: 'bottom',
        });
        toast.present();
    }
}