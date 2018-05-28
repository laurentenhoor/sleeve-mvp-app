import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Platform } from 'ionic-angular';

import { NoSleeve } from '../pages/no-sleeve/no-sleeve';
import { TabsPage } from '../pages/tabs/tabs';
import { Sessions } from '../providers/sessions';
import { PairModel } from '../providers/sleeves/pair.model';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    sessionsService: Sessions,
    pairedSleeves: PairModel
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      pairedSleeves.amountOfPairedSleeves().then((amount) => {
        console.log('initial amount', amount)
        if (amount == 0) {
          this.rootPage = TabsPage;
        } else {
          this.rootPage = TabsPage;
        }
      });

      if (platform.is('cordova')) {
        statusBar.styleDefault();
        splashScreen.hide();
      }
      sessionsService.setSession();
    });
  }
}