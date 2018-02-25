
import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { Feed } from 'api/models';
import { FeedType } from 'api/models';
import { Feeds } from 'api/collections';

@Component({
    selector: 'feed-input',
    templateUrl: 'feed-input.html'
})
export class FeedInput {
    selectedFeed;
    updatedFeed;

    constructor(
        private params: NavParams,
        public viewCtrl: ViewController
    ) {
        this.selectedFeed = params.get('feed')
        if (this.selectedFeed) {
            this.updatedFeed = this.selectedFeed
        } else {
            this.updatedFeed = {
                amount: 125,
                type: FeedType.MANUAL,
                timestamp: Date.now()
            }
        }
    }

    saveFeed() {
        if (this.updatedFeed._id) {
            Feeds.update({ _id: this.updatedFeed._id },
                this.updatedFeed
            )
        } else {
            Feeds.insert(this.updatedFeed).subscribe(() => { });
        }
        this.dismiss();
    }


    deleteFeed() {
        Feeds.remove({ _id: this.updatedFeed._id })
        this.dismiss();
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}