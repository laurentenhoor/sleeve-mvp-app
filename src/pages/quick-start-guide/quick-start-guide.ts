import { Component } from '@angular/core';
import { NavController, ViewController, App } from 'ionic-angular';

import { RemoveCap } from './remove-cap/remove-cap';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'quick-start-guide',
  templateUrl: 'quick-start-guide.html'
})
export class QuickStartGuide {

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public appCtrl: App,
  ) {
   
  }

  ionViewDidLoad() {
    this.viewCtrl.showBackButton(false);
  }

  nextStep() {
    this.navCtrl.push(RemoveCap)
  }

}