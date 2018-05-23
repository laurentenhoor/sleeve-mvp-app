
import { ViewChild, Component, NgZone } from '@angular/core';
import { AlertController, NavController, Slides, App, Events, ToastController, ModalController } from 'ionic-angular';
import { Sleeves } from '../../providers/sleeves';
import { QuickStart } from '../quick-start/quick-start';
import { Settings } from '../settings/settings';
import { UiSettings } from '../../providers/ui-settings';
import { Qsg } from '../qsg/qsg';


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
        private sleevesService: Sleeves,
        private uiSettings: UiSettings
    ) {
    }

    ionViewDidLoad() {
        this.events.subscribe('sleeve-disconnected', () => {
            // do something if sleeve disconnects
        });

        setTimeout(() => {
            // this.slides.slideTo(2)
        }, 200)

    }

    ionViewDidEnter() {
        this.checkBluetooth();
    }

    openQsg() {
        this.closeModal();
        if (this.uiSettings.defaultQsg) {
            this.modalCtrl.create(QuickStart).present();
        } else {
            this.modalCtrl.create(Qsg).present();
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

    startBlePairing() {
        console.log('Start BLE Scanning')
        this.sleevesService.scanAndConnect()
            .then(connectedSleeve => {
                console.log('Successfully connected to a sleeve', connectedSleeve)
                this.sleevesService.storeSleeve(connectedSleeve);
                this.hasPaired = true;
            }, error => {
                console.error(error);
            }).catch(error => console.error('serious error'))
    }

    closeModal() {
        this.nav.pop();
    }

    checkBluetooth() {
        this.sleevesService.isBluetoothEnabled()
            .then(() => {
                console.log('Bluetooth is turned ON.')
                this.bluetoothActivatedError = false;
            }).catch(() => {
                console.log('Bluetooth is turned OFF.')
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
            message: 'Please Use Your Sleeve!',
            duration: 3000,
            position: 'bottom',
        });
        toast.present();
    }
}