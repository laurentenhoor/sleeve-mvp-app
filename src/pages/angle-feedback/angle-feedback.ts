
import { Component, NgZone } from '@angular/core';
import { AlertController, NavController, ModalController } from 'ionic-angular';
import { Sleeves } from '../../providers/sleeves';

@Component({
    selector: 'angle-feedback',
    templateUrl: 'angle-feedback.html'
})
export class AngleFeedback {
    angle: number;
    color: string;
    message: string;

    constructor(
        private nav: NavController,
        public modalCtrl: ModalController,
        private sleevesService: Sleeves,
        private alertCtrl: AlertController,
        private zone: NgZone
    ) {
        this.color ='grey';
        this.message = 'Angle Feedback'
    }

    ionViewDidLoad() {
        this.sleevesService.angle().subscribe((angle) => {
            console.log('angle', angle);

            this.zone.run(() => {
                this.angle = angle;

                if (angle <= -75) // less than -75
                {
                    //feeding upside down !! 
                    this.color = "red";
                    this.message = "Too high!";
                }
                else if (angle >= -15 && angle <= 85) // 1 to 85
                {
                    //feeding angle kind of incorrect 
                    this.color = "orange";
                    this.message = "A little higher...";
                }
                else if (angle < -15 && angle >= -55) //0 to -74
                {
                    //feeding State
                    this.color = "green";
                    this.message = "Great!";
                }
                else if (angle < -55 && angle > -75) {
                    //feeding angle kind of incorrect 
                    this.color = "orange";
                    this.message = "A little lower...";
                }
                else {
                    //vertical Stable Case
                    this.color = 'grey';
                    this.message = '';
                }
            })
        }, error=>console.error(error))
    }

    ionViewDidEnter() {

    }

    closeModal() {
        this.nav.pop();
    }

}