import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';

@Injectable()
export class Feeds {
    data: any;
    localDb: any;
    remoteDb: any;

    constructor() {

        this.localDb = new PouchDB('feeds');        
        this.remoteDb = 'http://ec2-34-239-163-2.compute-1.amazonaws.com:5984/feeds';

        this.localDb.replicate.to(this.remoteDb, {
            live: true,
            retry: true,
            continuous: true,
        });

    }

    getFeeds() {
        if (this.data) {
            return Promise.resolve(this.data);
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

                resolve(this.data);

                this.localDb.changes({ live: true, since: 'now', include_docs: true }).on('change', (change) => {
                    this.handleChange(change);
                });

            }).catch((error) => {
                console.error(error);
            });

        });
    }

    createFeed(feed, callback) {
        this.localDb.post(feed).then((result)=>{
            console.log('createFeed', JSON.stringify(result));
            callback(result);
        }).catch((err) => {
            console.error(JSON.stringify(err));
        });
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
            this.data.splice(changedIndex, 1);
        }
        else {
            //A document was updated
            if (changedDoc) {
                this.data[changedIndex] = change.doc;
            }
            //A document was added
            else {
                this.data.push(change.doc);
            }

        }

    }
}
