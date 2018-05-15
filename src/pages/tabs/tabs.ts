import { Timeline } from '../timeline/timeline'
import { Bluetooth } from '../bluetooth/bluetooth'

import { Component, Input } from '@angular/core';
import { Events, NavController, Tabs, App } from 'ionic-angular';
import { QuickStart } from '../quick-start/quick-start';
import { Devices } from '../devices/devices';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1;
  tab2;
  tab3;
  amountOfAvailableFeeds = 0;

  constructor(
    private events: Events,
    private app: App
  ) {
    this.tab1 = Timeline;
    this.tab2 = Bluetooth;
    this.tab3 = Devices;

    events.subscribe('synchronize-feeds', () => {
      this.app.getActiveNavs()[0].parent.select(0);
    })
  }
}
