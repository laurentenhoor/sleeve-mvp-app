import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Sleeves, SleeveStates } from '../../../providers/sleeves';
import { WeighingStart } from '../weighing-start/weighing-start';


@Component({
  selector: 'press-button-start',
  templateUrl: 'press-button-start.html'
})
export class PressButtonStart {
  buttonPressed: boolean = false;

  constructor(
    public navCtrl: NavController,
    public sleevesService: Sleeves,
    public ngZone: NgZone
  ) {
    try {
      this.sleevesService.state().subscribe(state => {
        console.log('state received', state)
        if (state === SleeveStates.DEVICE_FEEDING_EXPECTED) {
          this.buttonPress();
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  buttonPress() {
    this.ngZone.run(()=>{
      this.buttonPressed = true;
    })
    
    setTimeout(() => {
      this.nextStep();
      this.buttonPressed = false;
    }, 500)
  }

  nextStep() {
    this.navCtrl.push(WeighingStart);
  }

}