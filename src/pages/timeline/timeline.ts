import {
  Component,
  NgZone,
  OnInit,
  ApplicationRef
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

import { Feeds } from '../../providers/feeds';
import { Sessions } from '../../providers/sessions';

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
    private applicationRef: ApplicationRef,
    private http: Http,
    public modalCtrl: ModalController,
    private events: Events,
    public feedsService: Feeds,
    public sessionsService: Sessions) {

    setTimeout(() => {
      this.fakeScan = true;
      this.events.publish('availableFeeds', 1);
    }, 2000);

    this.feeds = this.feedsService.getFeeds();

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
    var self = this;

    function generateFeed() {
      return {
        type: 'smart',
        timestamp: Date.now(),
        date: new Date(),
        amount: Math.random() * 210,
        sessionId: self.sessionsService.getSessionId()
      }
    }
    this.events.publish('availableFeeds', 0);

    this.feedsService.createFeed(generateFeed(), (result) => {
      setTimeout(() => {
        this.applicationRef.tick();
        }, 100);
      })
      
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