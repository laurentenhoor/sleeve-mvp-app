import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { BLE } from '@ionic-native/ble';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { Tabs } from '../pages/tabs/tabs';
import { Timeline } from '../pages/timeline/timeline';
import { Bluetooth } from '../pages/bluetooth/bluetooth';
import { FeedInput } from '../pages/feed-input/feed-input';

import { Connecting } from '../pages/connecting/connecting';
import { QuickStart } from '../pages/quick-start/quick-start';

import { Feeds } from '../providers/feeds';
import { Sessions } from '../providers/sessions';
import { Sleeves } from '../providers/sleeves';

import { Device } from '@ionic-native/device';

import { BlePacketParser } from '../pages/bluetooth/ble-packet-parser.service'

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Devices } from '../pages/devices/devices';
import { QuickStartGuide } from '../pages/quick-start-guide/quick-start-guide';
import { RemoveCap } from '../pages/quick-start-guide/remove-cap/remove-cap';
import { InsertBottle } from '../pages/quick-start-guide/insert-bottle/insert-bottle';
import { PressButtonStart } from '../pages/quick-start-guide/press-button-start/press-button-start';
import { WeighingStart } from '../pages/quick-start-guide/weighing-start/weighing-start';
import { Feeding } from '../pages/quick-start-guide/feeding/feeding';
import { Wiggle } from '../pages/quick-start-guide/wiggle/wiggle';
import { WeighingEnd } from '../pages/quick-start-guide/weighing-end/weighing-end';
import { PressButtonEnd } from '../pages/quick-start-guide/press-button-end/press-button-end';


@NgModule({
  declarations: [
    MyApp,
    Tabs,
    Timeline,
    Bluetooth,
    FeedInput,
    Connecting,
    QuickStart,
    Devices,
    QuickStartGuide,
    RemoveCap,
    InsertBottle,
    PressButtonStart,
    WeighingStart,
    Feeding,
    Wiggle,
    PressButtonEnd,
    WeighingEnd,
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
    Connecting,
    QuickStart,
    Devices,
    QuickStartGuide,
    RemoveCap,
    InsertBottle,
    PressButtonStart,
    WeighingStart,
    Feeding,
    Wiggle,
    PressButtonEnd,
    WeighingEnd,
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
    InAppBrowser,
  ]
})
export class AppModule {}
