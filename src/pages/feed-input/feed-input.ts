
import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { Feeds } from '../../providers/feeds'
import { Sessions } from '../../providers/sessions'

@Component({
    selector: 'feed-input',
    templateUrl: 'feed-input.html'
})
export class FeedInput {
    selectedFeed;
    updatedFeed;

    constructor(
        private params: NavParams,
        public viewCtrl: ViewController,
        public feedsService: Feeds,
        public sessionsService: Sessions,
    ) {
        this.selectedFeed = params.get('feed')
        if (this.selectedFeed) {
            this.updatedFeed = this.selectedFeed
        } else {
            this.updatedFeed = {
                amount: 125,
                type: 'manual',
                timestamp: Date.now(),
                date: new Date(),
                duration: 23,
                sessionId: this.sessionsService.getSessionId()
            }
        }
    }

    saveFeed() {
        if (this.updatedFeed._id) {
            this.feedsService.updateFeed(this.updatedFeed)
        } else {
            this.feedsService.createFeed(this.updatedFeed)
        }
        this.dismiss();
    }

    deleteFeed() {
        this.feedsService.deleteFeed(this.updatedFeed)
        this.dismiss();
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
    

}
