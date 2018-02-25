
import { Timeline } from '../timeline/timeline'
import { Bluetooth } from '../bluetooth/bluetooth'

import { Component, Input } from '@angular/core';
import { Events } from 'ionic-angular';

@Component({
  templateUrl: 'tabs.html'
})
export class Tabs {
  tab1;
  tab2;
  amountOfAvailableFeeds = 0;

  constructor(events: Events) {
    this.tab1 = Timeline;
    this.tab2 = Bluetooth;
    events.subscribe('availableFeeds', (amount) => {
      this.amountOfAvailableFeeds = amount;
    });
  }
}