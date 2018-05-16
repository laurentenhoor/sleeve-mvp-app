import { Injectable, NgZone } from '@angular/core';
import PouchDB from 'pouchdb';
import { Sessions } from './sessions';
import { orderBy } from 'lodash';

@Injectable()
export class Feeds {
    data: any = null;
    localDb: any;
    remoteDb: any;

    constructor(
        private zone: NgZone,
        private sessionsService: Sessions
    ) {

        this.localDb = new PouchDB('feeds');
        this.remoteDb = 'http://ec2-34-239-163-2.compute-1.amazonaws.com:5984/feeds';

        this.localDb.replicate.to(this.remoteDb, {
            live: true,
            retry: true,
            continuous: true,
        });
    }

    getFeeds(): Promise<Object[]> {
        if (this.data !== null) {
            return new Promise(resolve => { resolve(this.data) });
        }
        return new Promise(resolve => {

            this.localDb.allDocs({
                include_docs: true
            }).then((result) => {

                this.data = [];
                let docs = result.rows.map((row) => {
                    // console.log(row)
                    this.data.push(row.doc);
                });
                this.sortData();
                resolve(this.data);

                this.localDb.changes({ live: true, since: 'now', include_docs: true }).on('change', (change) => {
                    this.handleChange(change);
                });

            }).catch((error) => {
                console.error(error);
            });

        });
    }

    createFeed(feed) {
        this.localDb.post(feed).then((result) => {
            console.log('createFeed', JSON.stringify(result));
        }).catch((err) => {
            console.error(JSON.stringify(err));
        });
    }

    createFeedFromSleeve(sleeveFeed) {
        sleeveFeed = JSON.parse(sleeveFeed);
        let amount = 0;
        let duration = 0;
        if (sleeveFeed.m && sleeveFeed.m.w) {
            amount = sleeveFeed.m.w[0][1] - sleeveFeed.m.w[1][1]
        }
        if (sleeveFeed.m && sleeveFeed.m.i) {
            duration = sleeveFeed.m.i.reduce(function (acc, val) { return acc + val; });
        }
        let feed = {
            type: 'smart',
            timestamp: Date.now(),
            date: new Date(),
            amount: amount,
            duration: duration,
            sessionId: this.sessionsService.getSessionId()
        }
        this.createFeed(feed);
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
        this.getFeeds();
    }

    sortData() {
        this.data = orderBy(this.data, ['timestamp'], ['desc']);
    }

    handleChange(change) {

        let changedDoc = null;
        let changedIndex = null;

        this.data.forEach((doc, index) => {
            if (doc._id === change.id) {
                changedDoc = doc;
                changedIndex = index;
            }
        });
        //A document was deleted
        if (change.deleted) {
            this.zone.run(() => {
                this.data.splice(changedIndex, 1);
            });
        }
        else {
            //A document was updated
            if (changedDoc) {
                this.zone.run(() => {
                    this.data[changedIndex] = change.doc;
                });
            }
            //A document was added
            else {
                this.zone.run(() => {
                    this.data.unshift(change.doc);
                    
                });
            }

        }
        this.sortData()
    }
}
