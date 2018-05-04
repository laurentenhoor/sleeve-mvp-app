import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { InsertBottle } from '../insert-bottle/insert-bottle';

@Component({
  selector: 'remove-cap',
  templateUrl: 'remove-cap.html'
})
export class RemoveCap {
  
  constructor(
    public navCtrl: NavController,
  ) {

  }
  
  nextStep() {
      this.navCtrl.push(InsertBottle);
  }
}