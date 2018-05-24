import { Injectable, NgZone } from '@angular/core';
import PouchDB from 'pouchdb';
import { BLE } from '@ionic-native/ble';

@Injectable()
export class PairManager {
    private localDb: PouchDB.Database;
    pairedSleeves: any[] = [];

    constructor(
        private ble: BLE,
        private zone: NgZone
    ) {
        this.init();
    }

    private async init() {
        this.initLocalDb();
        this.pairedSleeves = await this.getPairedSleeves();
    }

    private getPairedSleeves(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.localDb.allDocs({
                include_docs: true,
                attachments: true
            }).then(result => {
                resolve(result.rows.map((row) => { return row.doc }));
            })
        })
    }

    initLocalDb() {
        this.localDb = new PouchDB('sleeves');
        this.localDb.changes({ live: true, since: 'now', include_docs: true }).on('change', (change) => {
            this.mimicLocalDbChangeInLocalVariable(change);
        });
    }

    storePairedSleeveId(sleeveId: string): void {
        console.log('storeSleeve', sleeveId)

        let self = this;

        this.localDb.get(sleeveId, {}, (err, doc) => {
            self.localDb.put({
                _id: sleeveId,
                _rev: doc ? doc._rev : null
            }, {}, (err, response) => {
                if (err) { return console.error(JSON.stringify(err)); }
            });
        });
    }

    disconnectAll(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.pairedSleeves.length == 0) {
                resolve();
            }

            let disconnectionCounter = 0;
            
            this.pairedSleeves.forEach((sleeve) => {
                this.ble.disconnect(sleeve._id).then(
                    success => {
                        console.log('disconnected', sleeve._id)
                        disconnectionCounter++;
                        if (disconnectionCounter == this.pairedSleeves.length) {
                            resolve();
                        }
                    },
                    error => {
                        console.error('disconnect', error)
                        reject();
                    }
                )
            });

        })

    }

    private mimicLocalDbChangeInLocalVariable(change): void {
        let changedDoc = null;
        let changedIndex = null;

        this.pairedSleeves.forEach((doc, index) => {
            if (doc._id === change.id) {
                changedDoc = doc;
                changedIndex = index;
            }
        });

        //A document was deleted
        if (change.deleted) {
            this.zone.run(() => {
                this.pairedSleeves.splice(changedIndex, 1);
            });
        }
        else {
            //A document was updated
            if (changedDoc) {
                this.zone.run(() => {
                    this.pairedSleeves[changedIndex] = change.doc;
                });
            }
            //A document was added
            else {
                this.zone.run(() => {
                    this.pairedSleeves.unshift(change.doc);
                });
            }
        }
    }

}