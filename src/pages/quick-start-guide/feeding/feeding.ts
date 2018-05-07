import { Component, NgZone } from '@angular/core';
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
    public sleevesService: Sleeves,
    public ngZone: NgZone
  ) {
    try {
      this.sleevesService.state().subscribe(state => {
        console.log('received state', state);
        if (state === '0400') {
          this.feedDetected();
        }
      })
    } catch (error) {
      console.error(error)
    }

  }

  feedDetected() {
    this.ngZone.run(()=>{
      this.feedIsDetected = true;
    });
    setTimeout(() => {
      this.nextStep();
      this.feedIsDetected = false;
    }, 500)
  }

  nextStep() {
    this.navCtrl.push(Wiggle);
  }

}