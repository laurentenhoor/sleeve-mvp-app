import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Sleeves } from '../../../providers/sleeves';
import { Feeding } from '../feeding/feeding';

@Component({
  selector: 'weighing-start',
  templateUrl: 'weighing-start.html'
})
export class WeighingStart {
  weighingDone: boolean = false;

  constructor(
    public navCtrl: NavController,
    public sleevesService: Sleeves,
    public ngZone: NgZone
  ) {
    try {
      this.sleevesService.state().subscribe(state => {
        console.log('state received', state);
        if (state === '0900') {
          this.weighingSuccessful();
        }
      })
    } catch (error) {
      console.error(error)
    }

  }

  weighingSuccessful() {
    this.ngZone.run(()=>{
      this.weighingDone = true;
    })
    setTimeout(() => {
      this.nextStep();
      this.weighingDone = false;
    }, 500)
  }

  nextStep() {
    this.navCtrl.push(Feeding);
  }

}