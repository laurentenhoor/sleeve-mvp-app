import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Sleeves, SleeveStates } from '../../../providers/sleeves';
import { Synchronize } from '../synchronize/synchronize';

@Component({
  selector: 'weighing-end',
  templateUrl: 'weighing-end.html'
})
export class WeighingEnd {
  private hasMeasured: boolean = false;
  private isMeasuring: boolean = false;

  constructor(
    public navCtrl: NavController,
    public sleevesService: Sleeves,
    public ngZone: NgZone
  ) {
    try {
      this.sleevesService.state().subscribe(state => {
        console.log('state received', state)
        if (state === SleeveStates.BUTTON_PRESSED) {
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
      this.navCtrl.push(Synchronize);
    }
  }

}