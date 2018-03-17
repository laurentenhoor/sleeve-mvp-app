import {
  Component,
  NgZone,
  OnInit
} from '@angular/core';

import { NavController, Events } from 'ionic-angular';

import {
  ToastController,
  ModalController
} from 'ionic-angular';

import * as _ from "lodash";
import * as moment from 'moment';

import { Http } from '@angular/http';

import { FeedInput } from '../feed-input/feed-input'
import { Feeds } from '../providers/feeds';

@Component({
  selector: 'timeline',
  templateUrl: 'timeline.html'
})
export class Timeline implements OnInit {
  fakeScan: any;
  public amountOfAvailableFeeds;
  private feeds: any;

  constructor(public navCtrl: NavController,
    private toastCtrl: ToastController,
    private ngZone: NgZone,
    private http: Http,
    public modalCtrl: ModalController,
    private events: Events,
    public feedsService: Feeds) {

    setTimeout(() => {
      this.fakeScan = true;
      this.events.publish('availableFeeds', 2);
    }, 500);

    this.feeds = this.feedsService.getFeeds()
  }

  ngOnInit() {
  }

  getAmountOfAvailableFeeds() {
    return this.amountOfAvailableFeeds;
  }

  formatTimeAgo(timestamp) {
    return moment(timestamp).fromNow();
  }

  addFakeFeeds() {

    function generateFeed() {
      return {
        type: 'smart',
        timestamp: Date.now(),
        amount: Math.random() * 210
      }
    }
    this.events.publish('availableFeeds', 0);
    
    this.feedsService.createFeed(generateFeed())
  
  }

  addFeed() {
    this.openFeedModal(null)
  }

  openFeedModal(feed) {
    let feedInputModal = this.modalCtrl.create(FeedInput, { feed: feed });
    feedInputModal.present();
  }

  showUnderConstructionAlert() {
    this.toastCtrl.create({
      message: 'Coming Soon!',
      position: 'top',
      duration: 2000
    }).present();
  }

}