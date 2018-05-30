import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BLE } from '@ionic-native/ble';
import { Device } from '@ionic-native/device';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { BlePacketParser } from '../pages/bluetooth/ble-packet-parser.service';
import { Bluetooth } from '../pages/bluetooth/bluetooth';
import { Connecting } from '../pages/connecting/connecting';
import { FeedInput } from '../pages/feed-input/feed-input';
import { NoSleeve } from '../pages/no-sleeve/no-sleeve';
import { Pairing } from '../pages/pairing/pairing';
import { Qsg } from '../pages/qsg/qsg';
import { QuickStartGuideModule } from '../pages/quick-start-guide/quick-start-guide.module';
import { QuickStart } from '../pages/quick-start/quick-start';
import { Settings } from '../pages/settings/settings';
import { TabsPage } from '../pages/tabs/tabs';
import { Timeline } from '../pages/timeline/timeline';
import { Feeds } from '../providers/feeds';
import { Sessions } from '../providers/sessions';
import { Sleeves } from '../providers/sleeves/sleeves';
import { SleevesModule } from '../providers/sleeves/sleeves.module';
import { UiSettings } from '../providers/ui-settings';
import { MyApp } from './app.component';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    Timeline,
    Bluetooth,
    FeedInput,
    Connecting,
    QuickStart,
    Settings,
    Qsg,
    Pairing,
    NoSleeve,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    QuickStartGuideModule,
    SleevesModule
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
    Settings,
    Qsg,
    Pairing,
    NoSleeve,
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
    UiSettings,
  ]
})
export class AppModule { }