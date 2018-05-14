import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Sleeves, SleeveStates } from '../../../providers/sleeves';
import { Feeding } from '../feeding/feeding';

@Component({
  selector: 'weighing-start',
  templateUrl: 'weighing-start.html'
})
export class WeighingStart {
  private isMeasuring: boolean = false;
  private hasMeasured: boolean = false;

  constructor(
    public navCtrl: NavController,
    public sleevesService: Sleeves,
    public ngZone: NgZone

  ) {
    try {
      this.sleevesService.state().subscribe(state => {
        console.log('state received', state)
        if (state === SleeveStates.DEVICE_FEEDING_EXPECTED) {
          this.measure();
        } else if (state == SleeveStates.DEVICE_WEIGHING_COMPLETED) {
          this.successfullyMeasured();
        } else if (state == SleeveStates.DEVICE_WEIGHING_TIMEOUT) {
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  measure() {
    console.log('measure called')
    this.ngZone.run(() => {
      this.isMeasuring = true;
    })
  }

  successfullyMeasured() {
    this.ngZone.run(() => {
      this.hasMeasured = true;
      this.isMeasuring = false;
    })
  }

  nextStep() {
    if (this.hasMeasured) {
      this.navCtrl.push(Feeding);
    }
  }

}