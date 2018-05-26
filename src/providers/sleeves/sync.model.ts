import { Injectable, NgZone } from '@angular/core';

@Injectable()
export class SyncModel {
    lastSyncTimestamp: number = 0;
    private syncTimestampDb: any;
    
    constructor(
        private zone: NgZone
    ) {
        this.syncTimestampDb = new PouchDB('syncTimestamp');
        this.initSyncTimestamp();
    }

    private initSyncTimestamp(): void {
        this.syncTimestampDb.get(
            'lastTimestamp'
        ).then(doc => {
            this.lastSyncTimestamp = doc.timestamp;
        }).catch(error => console.error(error));

        this.syncTimestampDb.changes({ live: true, since: 'now', include_docs: true }).on('change', (change) => {
            if (change && change.doc && change.doc.timestamp) {
                this.zone.run(() => {
                    this.lastSyncTimestamp = change.doc.timestamp;
                })
            }
        });
    }

    storeSyncTimestamp() {
        console.log('storelast SyncTimeStamp');
        let id = 'lastTimestamp';
        let self = this;
        this.syncTimestampDb.get(id, function (err, doc) {
            self.syncTimestampDb.put({
                _id: id,
                _rev: doc ? doc._rev : null,
                timestamp: Date.now() - 2000,
                date: new Date()
            }, function (err, response) {
                if (err) { return console.log(err); }
            });
        });
    }


}