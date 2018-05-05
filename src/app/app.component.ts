import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Tabs } from '../pages/tabs/tabs';
import { Connecting } from '../pages/connecting/connecting';
import { QuickStart } from '../pages/quick-start/quick-start';
import { QuickStartGuide } from '../pages/quick-start-guide/quick-start-guide';

import { Sessions } from '../providers/sessions';
import { Feeding } from '../pages/quick-start-guide/feeding/feeding';
import { Wiggle } from '../pages/quick-start-guide/wiggle/wiggle';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = Tabs;

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
