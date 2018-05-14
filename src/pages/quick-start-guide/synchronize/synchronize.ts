import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Sleeves, SleeveStates } from '../../../providers/sleeves';
import { Tabs } from '../../tabs/tabs';

@Component({
  selector: 'synchronize',
  templateUrl: 'synchronize.html'
})
export class Synchronize {
  weighingDone: boolean = false;

  constructor(
    public navCtrl: NavController,
  ) {
  }
  
  nextStep() {
    this.navCtrl.setRoot(Tabs)
  }

}