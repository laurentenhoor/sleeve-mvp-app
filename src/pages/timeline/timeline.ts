import { Component, NgZone, OnInit, ApplicationRef } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { ToastController, ModalController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';

import * as _ from "lodash";
import * as moment from 'moment';

import { FeedInput } from '../feed-input/feed-input'
import { Feeds } from '../../providers/feeds';
import { Sessions } from '../../providers/sessions';
import { Sleeves } from '../../providers/sleeves';
import { Connecting } from '../connecting/connecting';

@Component({
  selector: 'timeline',
  templateUrl: 'timeline.html'
})
export class Timeline implements OnInit {
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

    // setTimeout(() => {
    //   this.fakeScan = true;
    //   this.events.publish('availableFeeds', 1);
    // }, 2000);
    this.feeds = this.feedsService.getFeeds();
    // this.synchronizeFeeds();
    this.sleevesService.disconnectAll();

  }

  stopScanning() {
    console.log('stopScanning;')
    this.sleevesService.stopScanning();
  }

  synchronizeFeeds() {

    // this.sleevesService.connect('D93B40F4-C938-4070-B03E-22AADD33A00B', () => {
    //   this.sleevesService.fixedFeedData().then(feedData => {
    //     console.log('feedData', feedData)
    //   }, error => console.log(error)).catch(error => console.error(error));
    // })

    this.sleevesService.getPairedSleeves().then(pairedSleeves => {
      if (pairedSleeves.length == 0) {
        this.modalCtrl.create(Connecting).present();
      } else {
        // this.presentLoading()
        this.sleevesService.synchronizeFeeds().then(feedData => {
          console.log('feedData:', feedData)
        }).catch(error => {
          console.error(error);
        })

      }
    })
  }

  presentLoading() {
    let loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Synchronizing'
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 2000);
  }

  ionViewDidLoad() {
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

    this.feedsService.createFeed(generateFeed());
    setTimeout(() => {
      this.applicationRef.tick();
    }, 100);

  }

  addFeed() {
    this.openFeedModal(null)
    // this.sleevesService.disconnectAll();
    // this.sleevesService.sendDownloadFeedRequest();
    // this.sleevesService.feedData().then(data=>{console.log(data)})
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