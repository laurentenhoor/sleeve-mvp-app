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

import { Observable } from 'rxjs';
import { MeteorObservable } from 'meteor-rxjs';

import { Feed } from 'api/models';
import { FeedType } from 'api/models';
import { Feeds } from 'api/collections';

import { FeedInput } from '../feed-input/feed-input'

@Component({
  selector: 'timeline',
  templateUrl: 'timeline.html'
})
export class Timeline implements OnInit {
  feeds;
  fakeScan;
  public amountOfAvailableFeeds;

  constructor(public navCtrl: NavController,
    private toastCtrl: ToastController,
    private ngZone: NgZone,
    private http: Http,
    public modalCtrl: ModalController,
    private events: Events) {

    setTimeout(() => {
      this.fakeScan = true;
      this.events.publish('availableFeeds', 2);
    }, 5000);

  }

  getAmountOfAvailableFeeds() {
    return this.amountOfAvailableFeeds;
  }

  formatTimeAgo(timestamp) {
    return moment(timestamp).fromNow();
  }

  ngOnInit() {
    MeteorObservable.subscribe('feeds').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.feeds = this.findFeeds();
      });
    });
  }

  findFeeds() {
    return Feeds.find().map(feeds => {
      return _.orderBy(feeds, ['timestamp'], ['desc']);
    });
  }

  addFakeFeeds() {

    function generateFeed() {
      return {
        type: FeedType.SMART,
        timestamp: Date.now(),
        amount: Math.random() * 210
      }
    }
    this.events.publish('availableFeeds', 0);
    Feeds.insert(generateFeed());
    Feeds.insert(generateFeed());

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