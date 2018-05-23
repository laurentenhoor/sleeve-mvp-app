
import { ViewChild, Component, NgZone } from '@angular/core';
import { AlertController, NavController, Slides, App, Events, ToastController, ModalController } from 'ionic-angular';
import { Sleeves } from '../../providers/sleeves';


enum PairStep {
    PROPOSITION,
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

    constructor(
        private app: App,
        private nav: NavController,
        private zone: NgZone,
        private events: Events,
        private alertCtrl: AlertController,
        private toastCtrl: ToastController,
        private modalCtrl: ModalController,
        private sleevesService: Sleeves
    ) {
    }

    ionViewDidLoad() {
        this.events.subscribe('sleeve-disconnected', () => {
            // do something if sleeve disconnects
        });

        setTimeout(()=>{
            this.slides.slideTo(2)
        }, 200)
        
    }

    ionViewDidEnter() {
        this.checkBluetooth();
    }
    
    nextSlide() {
        this.slides.slideNext();
    }

    closeModal() {
        console.log('todo: implement closeModal()')
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