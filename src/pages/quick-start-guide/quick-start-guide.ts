import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { RemoveCap } from './remove-cap/remove-cap';

@Component({
  selector: 'quick-start-guide',
  templateUrl: 'quick-start-guide.html'
})
export class QuickStartGuide {
  
  constructor(
    public navCtrl: NavController,
  ) {

  }

  nextStep() {
      this.navCtrl.push(RemoveCap);
  }
  
}