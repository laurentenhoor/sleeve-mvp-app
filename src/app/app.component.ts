import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Sessions } from '../providers/sessions';

import { TabsPage } from '../pages/tabs/tabs';

import { QuickStartGuide } from '../pages/quick-start-guide/quick-start-guide';
import { QuickStart } from '../pages/quick-start/quick-start';
import { Qsg } from '../pages/qsg/qsg';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    sessionsService: Sessions
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if (platform.is('cordova')) {
        statusBar.styleDefault();
        splashScreen.hide();
      }
      sessionsService.setSession();
    });
  }
}