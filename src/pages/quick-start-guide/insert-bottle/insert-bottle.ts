import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { WeighingStart } from '../weighing-start/weighing-start';

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
   this.navCtrl.push(WeighingStart);
  }
  
}