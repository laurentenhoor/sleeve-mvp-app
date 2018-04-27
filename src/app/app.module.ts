import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { BLE } from '@ionic-native/ble';
// import { BluetoothLE } from '@ionic-native/bluetooth-le';
// import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { Tabs } from '../pages/tabs/tabs';
import { Timeline } from '../pages/timeline/timeline';
import { Bluetooth } from '../pages/bluetooth/bluetooth';
import { FeedInput } from '../pages/feed-input/feed-input';

import { FirstUse } from '../pages/first-use/first-use';
import { QuickStart } from '../pages/quick-start/quick-start';

import { Feeds } from '../providers/feeds';
import { Sessions } from '../providers/sessions';
import { Sleeves } from '../providers/sleeves';

import { Device } from '@ionic-native/device';

import { BlePacketParser } from '../pages/bluetooth/ble-packet-parser.service'

import { BrowserTab } from '@ionic-native/browser-tab';
import { InAppBrowser } from '@ionic-native/in-app-browser';


@NgModule({
  declarations: [
    MyApp,
    Tabs,
    Timeline,
    Bluetooth,
    FeedInput,
    FirstUse,
    QuickStart,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Tabs,
    Timeline,
    Bluetooth,
    FeedInput,
    FirstUse,
    QuickStart,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BLE,
    BlePacketParser,
    Feeds,
    Sessions,
    Sleeves,
    Device,
    BrowserTab,
    InAppBrowser,
  ]
})
export class AppModule {}
