import { Component, NgZone, OnInit, ApplicationRef, ViewChild } from '@angular/core';
import { NavController, Events, Content, App } from 'ionic-angular';
import { ToastController, ModalController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';

import * as _ from "lodash";
import * as moment from 'moment';

import { Feeds } from '../../providers/feeds';
import { Sessions } from '../../providers/sessions';
import { SleeveService } from '../../providers/sleeve/sleeve.service';

import { FeedInput } from '../feed-input/feed-input'
import { Pairing } from '../pairing/pairing';
import { NoSleeve } from '../no-sleeve/no-sleeve';


@Component({
  selector: 'timeline',
  templateUrl: 'timeline.html'
})
export class Timeline {
  @ViewChild(Content) content: Content;
  
  amountOfAvailableFeeds;
  private feeds: any;
  private synchronizing: boolean = false;
  private lastSyncTimestamp: Promise<number>;

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private ngZone: NgZone,
    private applicationRef: ApplicationRef,
    private http: Http,
    private modalCtrl: ModalController,
    private events: Events,
    private feedsService: Feeds,
    private sessionsService: Sessions,
    private sleeveService: SleeveService,
    private loadingCtrl: LoadingController,
    private app: App,

  ) {
    
  }

  ionViewDidLoad() {
    this.synchronizeFeeds();
  }

  synchronizeFeeds() {
    this.sleeveService.syncFeeds().then(feedData => {
      this.presentFeedToast();

    }).catch(error => {
      if (error === 'scanTimeout') {
        this.presentTimeoutToast();

      } else if (error === 'no paired devices') {
        this.presentNoPairedDevicesToast();

      } else {
        console.error(error);
      }

    })
  }

  presentTimeoutToast() {
    let toast = this.toastCtrl.create({
      message: 'No New Feeds Found',
      duration: 5000,
      showCloseButton: true,
      closeButtonText: 'Close',
      position: 'top',
    });
    toast.present();
  }

  presentBusyToast() {
    let toast = this.toastCtrl.create({
      message: 'Sync in Progress',
      duration: 5000,
      showCloseButton: true,
      closeButtonText: 'Close',
      position: 'top',
    });
    toast.present();
  }

  presentNoPairedDevicesToast() {
    let toast = this.toastCtrl.create({
      message: 'No Smart Sleeve Paired',
      duration: 5000,
      showCloseButton: true,
      closeButtonText: 'Close',
      position: 'top',
    });
    toast.present();
  }

  presentFeedToast() {
    let toast = this.toastCtrl.create({
      message: 'One New Feed Synced',
      duration: 5000,
      showCloseButton: true,
      closeButtonText: 'Close',
      position: 'top',
    });
    toast.present();
  }

  openSettings() {
    this.navCtrl.push(Bluetooth)
  }

  formatTimeAgo(timestamp) {
    return moment(timestamp).fromNow();
  }

  addFeed() {
    this.openFeedModal(null)
  }

  openFeedModal(feed) {
    let feedInputModal = this.modalCtrl.create(FeedInput, { feed: feed });
    feedInputModal.present();
  }

  deleteFeed(feed) {
    this.feedsService.deleteFeed(feed);
  }

}