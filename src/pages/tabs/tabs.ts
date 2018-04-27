
import { Timeline } from '../timeline/timeline'
import { Bluetooth } from '../bluetooth/bluetooth'

import { Component, Input } from '@angular/core';
import { Events } from 'ionic-angular';
import { QuickStart } from '../quick-start/quick-start';
import { FirstUse } from '../first-use/first-use';

@Component({
  templateUrl: 'tabs.html'
})
export class Tabs {
  tab1;
  tab2;
  tab3;
  amountOfAvailableFeeds = 0;

  constructor(events: Events) {
    this.tab1 = Timeline;
    this.tab2 = Bluetooth;
    this.tab3 = FirstUse;

    events.subscribe('availableFeeds', (amount) => {
      this.amountOfAvailableFeeds = amount;
    });
  }
}