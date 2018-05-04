import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PressButtonStart } from '../press-button-start/press-button-start';

@Component({
  selector: 'insert-bottle',
  templateUrl: 'insert-bottle.html'
})
export class InsertBottle {
  
  constructor(
    public navCtrl: NavController,
  ) {

  }

  nextStep() {
   this.navCtrl.push(PressButtonStart);
  }
  
}