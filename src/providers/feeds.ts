import { Injectable, NgZone } from '@angular/core';
import { orderBy } from 'lodash';
import PouchDB from 'pouchdb';
import { Sessions } from './sessions';

@Injectable()
export class Feeds {
    feeds: any = [];
    localDb: any;
    remoteDb: any;

    constructor(
        private zone: NgZone,
        private sessionsService: Sessions
    ) {
        this.initLocalDb()
        this.setupRemoteDbSynchronization()
    }

    private async initLocalDb() {

        this.localDb = new PouchDB('feeds');

        this.localDb.changes({ live: true, since: 'now', include_docs: true }).on('change', (change) => {
            this.mimicLocalDbChangeInLocalVariable(change);
        });

        let feeds = await this.getAllFeedsFromLocalDb();
        this.feeds = this.sortData(feeds);
    }

    private setupRemoteDbSynchronization() {
        const remoteDb = 'http://ec2-34-239-163-2.compute-1.amazonaws.com:5984/feeds';
        this.localDb.replicate.to(remoteDb, {
            live: true,
            retry: true,
            continuous: true,
        });
    }

    private getAllFeedsFromLocalDb(): Promise<any[]> {
        return new Promise((resolve) => {
            this.localDb.allDocs({
                include_docs: true
            }).then((result) => {
                let feeds = [];
                let docs = result.rows.map((row) => {
                    feeds.push(row.doc);
                });
                resolve(feeds)
            })
        })
    }

    updateFeed(feed) {
        this.localDb.put(feed).catch((err) => {
            console.error(err);
        });

    }

    deleteFeed(feed) {
        this.localDb.remove(feed).catch((err) => {
            console.error(err);
        });
    }

    createFeed(feed) {
        this.localDb.post(feed).then((result) => {
            console.log('createFeed', JSON.stringify(result));
        }).catch((err) => {
            console.error(JSON.stringify(err));
        });
    }

    createFeedFromSleeve(sleeveFeedData) {
        this.createFeed(this.parseSleeveData(sleeveFeedData));
    }

    private parseSleeveData(rawSleeveFeedData) {
        let sleeveFeedData = JSON.parse(rawSleeveFeedData);

        let amount = 0;
        if (sleeveFeedData.m && sleeveFeedData.m.w) {
            amount = sleeveFeedData.m.w[0][1] - sleeveFeedData.m.w[1][1]
        }

        let duration = 0;
        if (sleeveFeedData.m && sleeveFeedData.m.i) {
            duration = sleeveFeedData.m.i.reduce(function (acc, val) { return acc + val; });
        }

        return {
            type: 'smart',
            timestamp: Date.now(),
            date: new Date(),
            amount: amount,
            duration: duration,
            sessionId: this.sessionsService.getSessionId()
        }
    }


    private sortData(feedArray): Array<any> {
        return orderBy(feedArray, ['timestamp'], ['desc']);
    }

    private mimicLocalDbChangeInLocalVariable(change) {

        let changedDoc = null;
        let changedIndex = null;

        this.feeds.forEach((doc, index) => {
            if (doc._id === change.id) {
                changedDoc = doc;
                changedIndex = index;
            }
        });

        //A document was deleted
        if (change.deleted) {
            this.zone.run(() => {
                this.feeds.splice(changedIndex, 1);
            });
        }
        else {
            //A document was updated
            if (changedDoc) {
                this.zone.run(() => {
                    this.feeds[changedIndex] = change.doc;
                });
            }
            //A document was added
            else {
                this.zone.run(() => {
                    this.feeds.unshift(change.doc);
                });
            }

        }
        this.feeds = this.sortData(this.feeds)
    }
}
