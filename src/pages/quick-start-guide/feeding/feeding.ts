import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Sleeves } from '../../../providers/sleeves';
import { Wiggle } from '../wiggle/wiggle';

@Component({
  selector: 'feeding',
  templateUrl: 'feeding.html'
})
export class Feeding {
  feedIsDetected: boolean = false;

  constructor(
    public navCtrl: NavController,
    public sleevesService: Sleeves
  ) {
    try {
      this.sleevesService.state().subscribe(state => {
        if (state === '0400') {
          this.feedDetected();
        }
      })
    } catch (error) {
      console.error(error)
    }

  }

  feedDetected() {
    this.feedIsDetected = true;
    setTimeout(() => {
      this.nextStep();
      this.feedIsDetected = false;
    }, 500)
  }

  nextStep() {
    this.navCtrl.push(Wiggle);
  }

}