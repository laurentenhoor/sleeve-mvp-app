
import { Timeline } from '../timeline/timeline'
import { Bluetooth } from '../bluetooth/bluetooth'

import { Component } from '@angular/core';

@Component({
    templateUrl: 'tabs.html'
})
  export class Tabs {
    tab1;
    tab2;

    constructor() {
      this.tab1 = Timeline;
      this.tab2 = Bluetooth;
    }
  }