import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Sleeves } from '../../../providers/sleeves';
import { Tabs } from '../../tabs/tabs';

@Component({
  selector: 'weighing-end',
  templateUrl: 'weighing-end.html'
})
export class WeighingEnd {
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
    this.ngZone.run(() => {
      this.weighingDone = true;
    });
    setTimeout(() => {
      this.nextStep();
      this.weighingDone = false;
    }, 2000)
  }

  nextStep() {
    this.navCtrl.setRoot(Tabs)
  }

}