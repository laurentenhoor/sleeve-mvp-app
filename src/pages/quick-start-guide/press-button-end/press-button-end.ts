import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Sleeves } from '../../../providers/sleeves';
import { WeighingEnd } from '../weighing-end/weighing-end';


@Component({
  selector: 'press-button-end',
  templateUrl: 'press-button-end.html'
})
export class PressButtonEnd {
  buttonPressed: boolean = false;

  constructor(
    public navCtrl: NavController,
    public sleevesService: Sleeves,
    public ngZone: NgZone
  ) {
    try {
      this.sleevesService.state().subscribe(state => {
        console.log('state received', state);
        if (state === '0c00') {
          this.buttonPress();
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  buttonPress() {
    this.ngZone.run(() => {
      this.buttonPressed = true;
    });
    setTimeout(() => {
      this.nextStep();
      this.buttonPressed = false;
      
    }, 500)
  }

  nextStep() {
    this.navCtrl.push(WeighingEnd);
  }

}