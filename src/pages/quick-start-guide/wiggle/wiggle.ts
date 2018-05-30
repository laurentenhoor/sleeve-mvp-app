import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Sleeves, SleeveStates } from '../../../providers/sleeves/sleeves';
import { WeighingEnd } from '../weighing-end/weighing-end';


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
        if (state === SleeveStates.DEVICE_WIGGLING) {
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
  }

  nextStep() {
    if (this.wiggleIsDetected) {
      this.navCtrl.push(WeighingEnd);
    }
  }

}