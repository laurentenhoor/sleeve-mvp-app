import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Sleeves } from '../../../providers/sleeves';
import { PressButtonEnd } from '../press-button-end/press-button-end';

@Component({
  selector: 'wiggle',
  templateUrl: 'wiggle.html'
})
export class Wiggle {
  wiggleIsDetected: boolean = false;

  constructor(
    public navCtrl: NavController,
    public sleevesService: Sleeves,
    public ngZone: NgZone
  ) {
    try {
      this.sleevesService.state().subscribe(state => {
        console.log('state received', state);
        if (state === '0b00') {
          this.wiggleDetected();
        }
      })
    } catch (error) {
      console.error(error)
    }

  }

  wiggleDetected() {
    this.ngZone.run(() => {
      this.wiggleIsDetected = true;
    });
    setTimeout(() => {
      this.nextStep();
      this.wiggleIsDetected = false;
    }, 500)
  }

  nextStep() {
    this.navCtrl.push(PressButtonEnd);
  }

}