import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BLE } from '@ionic-native/ble';
import { Device } from '@ionic-native/device';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { FeedInput } from '../pages/feed-input/feed-input';
import { NoSleeve } from '../pages/no-sleeve/no-sleeve';
import { Pairing } from '../pages/pairing/pairing';

import { Settings } from '../pages/settings/settings';
import { TabsPage } from '../pages/tabs/tabs';
import { Timeline } from '../pages/timeline/timeline';
import { Feeds } from '../providers/feeds';
import { Sessions } from '../providers/sessions';


import { QuickStartList } from '../pages/quick-start-list/quick-start-list';
import { QuickStartSlides } from '../pages/quick-start-slides/quick-start-slides';

import { UiSettings } from '../providers/ui-settings';
import { MyApp } from './app.component';

import { SleeveModule } from '../providers/sleeve/sleeve.module';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    Timeline,
    FeedInput,
    QuickStartSlides,
    QuickStartList,
    Settings,
    Pairing,
    NoSleeve,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    SleeveModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    Timeline,
    FeedInput,
    QuickStartSlides,
    QuickStartList,
    Settings,
    Pairing,
    NoSleeve,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    BLE,
    Feeds,
    Sessions,
    Device,
    InAppBrowser,
    UiSettings,
  ]
})
export class AppModule { }