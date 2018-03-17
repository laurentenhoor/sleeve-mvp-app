import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';

@Injectable()
export class Feeds {
    data: any;
    db: any;
    remote: any;

    constructor() {

        this.db = new PouchDB('sleeve');

        this.remote = 'http://localhost:5984/sleeve';

        let options = {
            live: true,
            retry: true,
            continuous: true
        };

        this.db.sync(this.remote, options);

    }

    getFeeds() {
        if (this.data) {
            return Promise.resolve(this.data);
        }

        return new Promise(resolve => {

            this.db.allDocs({

                include_docs: true

            }).then((result) => {

                this.data = [];

                let docs = result.rows.map((row) => {
                    // console.log(row)
                    this.data.push(row.doc);
                });

                
                resolve(this.data);

                this.db.changes({ live: true, since: 'now', include_docs: true }).on('change', (change) => {
                    this.handleChange(change);
                });

            }).catch((error) => {

                console.log(error);

            });

        });
    }

    createFeed(feed) {
        this.db.post(feed).catch((err) => {
            console.error(JSON.stringify(err));
        });
    }

    updateFeed(feed) {
        this.db.put(feed).catch((err) => {
            console.error(err);
        });

    }

    deleteFeed(feed) {
        this.db.remove(feed).catch((err) => {
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
