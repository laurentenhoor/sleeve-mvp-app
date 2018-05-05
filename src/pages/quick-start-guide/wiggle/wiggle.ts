import { Component } from '@angular/core';
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
    public sleevesService: Sleeves
  ) {
    try {
      this.sleevesService.state().subscribe(state => {
        if (state === '0400') {
          this.wiggleDetected();
        }
      })
    } catch (error) {
      console.error(error)
    }

  }

  wiggleDetected() {
    this.wiggleIsDetected = true;
    setTimeout(() => {
      this.nextStep();
      this.wiggleIsDetected = false;
    }, 500)
  }

  nextStep() {
    this.navCtrl.push(PressButtonEnd);
  }

}