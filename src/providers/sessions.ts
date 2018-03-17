import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';

import { Device } from '@ionic-native/device';

@Injectable()
export class Sessions {
    data: any;
    localDb: any;
    remoteDb: any;
    session: any;
    dbName: string = 'sessions';

    constructor(
        private device: Device) {

        this.localDb = new PouchDB(this.dbName);
        this.remoteDb = 'http://ec2-34-239-163-2.compute-1.amazonaws.com:5984/' + this.dbName;

        this.localDb.replicate.to(this.remoteDb, {
            live: true,
            retry: true,
            continuous: true,
        });

    }

    getSessionId() {
        if (this.session) {
            return this.session._id;
        }
        return 'unknown session';
    }

    setSession() {
        this.localDb.allDocs({
            include_docs: true
        }).then((result) => {
            if (!result || result.total_rows < 1) {
                this.createSession();
            } else if (result.total_rows > 1) {
                console.error('DETECTED MULTIPLE SESSIONS RESETTING')
                this.clearDatabase();
            } else {
                console.log('existing session', JSON.stringify(result))
                this.session = result.rows[0] || {};
            }
        })

    }

    clearDatabase() {
        this.localDb.destroy().then(() => {
            this.localDb = new PouchDB(this.dbName);
            this.createSession();
        });
    }

    createSession() {
        this.session = {
            cordova: this.device.cordova,
            platform: this.device.platform,
            model: this.device.model,
            uuid: this.device.uuid,
            osVersion: this.device.version,
            manufacturer: this.device.manufacturer,
            isVirtual: this.device.isVirtual,
            serial: this.device.serial
        };

        this.localDb.post(this.session).then((result) => {
            this.session = result;
        }).catch((err) => {
            console.error(JSON.stringify(err));
        });

        return this.session;

    }
}
