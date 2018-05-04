import { Component } from '@angular/core';
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
    public sleevesService: Sleeves
  ) {
    try {
      this.sleevesService.state().subscribe(state => {
        if (state === '0000') {
          this.buttonPress();
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  buttonPress() {
    this.buttonPressed = true;
    setTimeout(() => {
      this.nextStep();
      this.buttonPressed = false;
      
    }, 2000)
  }

  nextStep() {
    this.navCtrl.push(WeighingEnd);
  }

}