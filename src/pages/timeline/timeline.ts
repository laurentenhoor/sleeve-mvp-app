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
import { Bluetooth } from '../bluetooth/bluetooth';

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
    this.feeds = this.feedsService.getFeeds();
    this.synchronizeFeeds();
    // this.sleevesService.disconnectAll();
  }

  stopScanning() {
    console.log('stopScanning;')
    this.sleevesService.stopScanning();
  }

  synchronizeFeeds() {


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

  openSettings(){
    this.navCtrl.push(Bluetooth)
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

  addFeed() {
    this.openFeedModal(null)
  }

  openFeedModal(feed) {
    let feedInputModal = this.modalCtrl.create(FeedInput, { feed: feed });
    feedInputModal.present();
  }

}