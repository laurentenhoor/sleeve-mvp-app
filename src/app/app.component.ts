import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Sessions } from '../providers/sessions';

import { TabsPage } from '../pages/tabs/tabs';

import { QuickStartGuide } from '../pages/quick-start-guide/quick-start-guide';
import { QuickStart } from '../pages/quick-start/quick-start';
import { Qsg } from '../pages/qsg/qsg';
import { Pairing } from '../pages/pairing/pairing';
import { Sleeves } from '../providers/sleeves';
import { NoSleeve } from '../pages/no-sleeve/no-sleeve';

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
    sleevesService: Sleeves
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      sleevesService.amountOfPairedSleeves().then((amount) => {
        if (amount == 0) {
          this.rootPage = NoSleeve;
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