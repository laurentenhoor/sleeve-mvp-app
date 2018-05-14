import { Component, NgZone, OnInit, ApplicationRef, ViewChild } from '@angular/core';
import { NavController, Events, Content } from 'ionic-angular';
import { ToastController, ModalController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';

import * as _ from "lodash";
import * as moment from 'moment';

import { FeedInput } from '../feed-input/feed-input'
import { Feeds } from '../../providers/feeds';
import { Sessions } from '../../providers/sessions';
import { Sleeves } from '../../providers/sleeves';
import { Connecting } from '../connecting/connecting';
import { Bluetooth } from '../bluetooth/bluetooth';



@Component({
  selector: 'timeline',
  templateUrl: 'timeline.html'
})
export class Timeline {
  @ViewChild(Content) content: Content;
  fakeScan: any;
  public amountOfAvailableFeeds;
  private feeds: any;
  private synchronizing: boolean = false;

  constructor(
    public navCtrl: NavController,
    private toastCtrl: ToastController,
    private ngZone: NgZone,
    private applicationRef: ApplicationRef,
    private http: Http,
    public modalCtrl: ModalController,
    private events: Events,
    public feedsService: Feeds,
    public sessionsService: Sessions,
    public sleevesService: Sleeves,
    public loadingCtrl: LoadingController,
  ) {
    events.subscribe('synchronize-feeds', () => {
      this.synchronizeFeeds();
    });
  }

  ionViewDidLoad() { 
    this.synchronizeFeeds();
    this.feeds = this.feedsService.getFeeds();
  }

  synchronizeFeeds() {

    this.sleevesService.getPairedSleeves().then(pairedSleeves => {
      
      if (pairedSleeves.length == 0) {
        this.modalCtrl.create(Connecting).present();

      } else {
        this.sleevesService.synchronizeFeeds().then(feedData => {
          this.presentFeedToast();

        }).catch(error => {
          if (error === 'scanTimeout') {
            this.presentTimeoutToast();
          } else {
            console.error(error);
          }

        })
      }
    })
  }

  presentTimeoutToast() {
    let toast = this.toastCtrl.create({
      message: 'No new feeds found',
      duration: 5000,
      showCloseButton: true,
      closeButtonText: 'Close',
      position: 'top',
    });
    toast.present();
  }

  presentFeedToast() {
    let toast = this.toastCtrl.create({
      message: 'One new feed synced',
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

}