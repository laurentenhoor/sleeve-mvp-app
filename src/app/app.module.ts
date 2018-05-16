import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { BLE } from '@ionic-native/ble';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { Timeline } from '../pages/timeline/timeline';
import { Bluetooth } from '../pages/bluetooth/bluetooth';
import { FeedInput } from '../pages/feed-input/feed-input';

import { Connecting } from '../pages/connecting/connecting';
import { QuickStart } from '../pages/quick-start/quick-start';
import { Qsg } from '../pages/qsg/qsg';

import { Feeds } from '../providers/feeds';
import { Sessions } from '../providers/sessions';
import { Sleeves } from '../providers/sleeves';

import { Device } from '@ionic-native/device';

import { BlePacketParser } from '../pages/bluetooth/ble-packet-parser.service'

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Devices } from '../pages/devices/devices';

import { QuickStartGuideModule } from '../pages/quick-start-guide/quick-start-guide.module';
import { AngleFeedback } from '../pages/angle-feedback/angle-feedback';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    Timeline,
    Bluetooth,
    FeedInput,
    Connecting,
    QuickStart,
    Devices,
    Qsg,
    AngleFeedback,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    QuickStartGuideModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    Timeline,
    Bluetooth,
    FeedInput,
    Connecting,
    QuickStart,
    Devices,
    Qsg,
    AngleFeedback,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    BLE,
    BlePacketParser,
    Feeds,
    Sessions,
    Sleeves,
    Device,
    InAppBrowser,
  ]
})
export class AppModule { }