webpackJsonp([0],{

/***/ 104:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var pouchdb_1 = __webpack_require__(321);
var Feeds = /** @class */ (function () {
    function Feeds() {
        this.localDb = new pouchdb_1.default('feeds');
        this.remoteDb = 'http://ec2-34-239-163-2.compute-1.amazonaws.com:5984/feeds';
        this.localDb.replicate.to(this.remoteDb, {
            live: true,
            retry: true,
            continuous: true,
        });
    }
    Feeds.prototype.getFeeds = function () {
        var _this = this;
        if (this.data) {
            return Promise.resolve(this.data);
        }
        return new Promise(function (resolve) {
            _this.localDb.allDocs({
                include_docs: true
            }).then(function (result) {
                _this.data = [];
                var docs = result.rows.map(function (row) {
                    // console.log(row)
                    _this.data.push(row.doc);
                });
                resolve(_this.data);
                _this.localDb.changes({ live: true, since: 'now', include_docs: true }).on('change', function (change) {
                    _this.handleChange(change);
                });
            }).catch(function (error) {
                console.error(error);
            });
        });
    };
    Feeds.prototype.createFeed = function (feed) {
        this.localDb.post(feed).catch(function (err) {
            console.error(JSON.stringify(err));
        });
    };
    Feeds.prototype.updateFeed = function (feed) {
        this.localDb.put(feed).catch(function (err) {
            console.error(err);
        });
    };
    Feeds.prototype.deleteFeed = function (feed) {
        this.localDb.remove(feed).catch(function (err) {
            console.error(err);
        });
    };
    Feeds.prototype.handleChange = function (change) {
        var changedDoc = null;
        var changedIndex = null;
        this.data.forEach(function (doc, index) {
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
            else {
                this.data.push(change.doc);
            }
        }
    };
    Feeds = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], Feeds);
    return Feeds;
}());
exports.Feeds = Feeds;
//# sourceMappingURL=feeds.js.map

/***/ }),

/***/ 114:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 114;

/***/ }),

/***/ 155:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 155;

/***/ }),

/***/ 199:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var timeline_1 = __webpack_require__(200);
var bluetooth_1 = __webpack_require__(326);
var core_1 = __webpack_require__(0);
var ionic_angular_1 = __webpack_require__(19);
var Tabs = /** @class */ (function () {
    function Tabs(events) {
        var _this = this;
        this.amountOfAvailableFeeds = 0;
        this.tab1 = timeline_1.Timeline;
        this.tab2 = bluetooth_1.Bluetooth;
        events.subscribe('availableFeeds', function (amount) {
            _this.amountOfAvailableFeeds = amount;
        });
    }
    Tabs = __decorate([
        core_1.Component({template:/*ion-inline-start:"/Users/310172519/git/sleeve-mvp-app/src/pages/tabs/tabs.html"*/'<ion-tabs selectedIndex="0">\n  <ion-tab tabIcon="water" tabTitle="Feeding Journal" [root]="tab1" tabBadge="{{ amountOfAvailableFeeds ? amountOfAvailableFeeds : \'\'}}" tabBadgeStyle="danger"></ion-tab>\n  <ion-tab tabIcon="bluetooth" tabTitle="Bluetooth Settings" [root]="tab2"></ion-tab>\n</ion-tabs>'/*ion-inline-end:"/Users/310172519/git/sleeve-mvp-app/src/pages/tabs/tabs.html"*/
        }),
        __metadata("design:paramtypes", [ionic_angular_1.Events])
    ], Tabs);
    return Tabs;
}());
exports.Tabs = Tabs;
//# sourceMappingURL=tabs.js.map

/***/ }),

/***/ 200:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var ionic_angular_1 = __webpack_require__(19);
var ionic_angular_2 = __webpack_require__(19);
var moment = __webpack_require__(1);
var http_1 = __webpack_require__(103);
var feed_input_1 = __webpack_require__(320);
var feeds_1 = __webpack_require__(104);
var sessions_1 = __webpack_require__(53);
var Timeline = /** @class */ (function () {
    function Timeline(navCtrl, toastCtrl, ngZone, http, modalCtrl, events, feedsService, sessionsService) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
        this.ngZone = ngZone;
        this.http = http;
        this.modalCtrl = modalCtrl;
        this.events = events;
        this.feedsService = feedsService;
        this.sessionsService = sessionsService;
        setTimeout(function () {
            _this.fakeScan = true;
            _this.events.publish('availableFeeds', 2);
        }, 2000);
        this.feeds = this.feedsService.getFeeds();
    }
    Timeline.prototype.ngOnInit = function () {
    };
    Timeline.prototype.getAmountOfAvailableFeeds = function () {
        return this.amountOfAvailableFeeds;
    };
    Timeline.prototype.formatTimeAgo = function (timestamp) {
        return moment(timestamp).fromNow();
    };
    Timeline.prototype.addFakeFeeds = function () {
        var self = this;
        function generateFeed() {
            return {
                type: 'smart',
                timestamp: Date.now(),
                date: new Date(),
                amount: Math.random() * 210,
                sessionId: self.sessionsService.getSessionId()
            };
        }
        this.events.publish('availableFeeds', 0);
        this.feedsService.createFeed(generateFeed());
    };
    Timeline.prototype.addFeed = function () {
        this.openFeedModal(null);
    };
    Timeline.prototype.openFeedModal = function (feed) {
        var feedInputModal = this.modalCtrl.create(feed_input_1.FeedInput, { feed: feed });
        feedInputModal.present();
    };
    Timeline.prototype.showUnderConstructionAlert = function () {
        this.toastCtrl.create({
            message: 'Coming Soon!',
            position: 'top',
            duration: 2000
        }).present();
    };
    Timeline = __decorate([
        core_1.Component({
            selector: 'timeline',template:/*ion-inline-start:"/Users/310172519/git/sleeve-mvp-app/src/pages/timeline/timeline.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>\n      Feeding Journal\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n\n  <ion-card *ngIf="fakeScan">\n    <img src="assets/imgs/cute-baby-banner.jpg"\n    />\n    <ion-card-header>\n      One new feed available on your sleeve!\n    </ion-card-header>\n\n    <ion-item>\n\n      <button ion-button icon-left clear item-end (click)="fakeScan=false;fakeFeeds=true;addFakeFeeds();">\n        <ion-icon name="sync"></ion-icon>\n        Synchronize\n      </button>\n    </ion-item>\n\n  </ion-card>\n\n  <ion-card *ngFor="let feed of feeds | async" (click)="openFeedModal(feed)">\n    <ion-item>\n      <ion-icon color="{{ feed.type == \'smart\' ? \'secondary\' : \'primary\' }}" name="water" item-left large></ion-icon>\n      <h2>{{ feed.amount | number : \'1.0-0\' }} ml</h2>\n      <h3>{{ formatTimeAgo(feed.timestamp) }}</h3>\n      <p>\n        <ion-icon name="{{ feed.type == \'smart\' ? \'bluetooth\' : \'hand\' }}" item-left large></ion-icon>{{ feed.type == \'smart\' ? \'Smart Bottle Tracker\' : \'Manual\' }}</p>\n    </ion-item>\n  </ion-card>\n\n  <ion-fab right bottom #fab>\n\n    <button ion-fab color="light">\n      <ion-icon name="add"></ion-icon>\n    </button>\n\n    <ion-fab-list side="top">\n\n      <button ion-fab (click)="addFeed();fab.close();">\n        \n        <ion-icon class="logo"></ion-icon>\n      \n      </button>\n\n      <button ion-fab (click)="showUnderConstructionAlert();fab.close();">\n        <ion-icon name="heart"></ion-icon>\n      </button>\n\n    </ion-fab-list>\n  </ion-fab>\n\n</ion-content>'/*ion-inline-end:"/Users/310172519/git/sleeve-mvp-app/src/pages/timeline/timeline.html"*/
        }),
        __metadata("design:paramtypes", [ionic_angular_1.NavController,
            ionic_angular_2.ToastController,
            core_1.NgZone,
            http_1.Http,
            ionic_angular_2.ModalController,
            ionic_angular_1.Events,
            feeds_1.Feeds,
            sessions_1.Sessions])
    ], Timeline);
    return Timeline;
}());
exports.Timeline = Timeline;
//# sourceMappingURL=timeline.js.map

/***/ }),

/***/ 320:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var ionic_angular_1 = __webpack_require__(19);
var feeds_1 = __webpack_require__(104);
var sessions_1 = __webpack_require__(53);
var FeedInput = /** @class */ (function () {
    function FeedInput(params, viewCtrl, feedsService, sessionsService) {
        this.params = params;
        this.viewCtrl = viewCtrl;
        this.feedsService = feedsService;
        this.sessionsService = sessionsService;
        this.selectedFeed = params.get('feed');
        if (this.selectedFeed) {
            this.updatedFeed = this.selectedFeed;
        }
        else {
            this.updatedFeed = {
                amount: 125,
                type: 'manual',
                timestamp: Date.now(),
                date: new Date(),
                sessionId: this.sessionsService.getSessionId()
            };
        }
    }
    FeedInput.prototype.saveFeed = function () {
        if (this.updatedFeed._id) {
            this.feedsService.updateFeed(this.updatedFeed);
        }
        else {
            this.feedsService.createFeed(this.updatedFeed);
        }
        this.dismiss();
    };
    FeedInput.prototype.deleteFeed = function () {
        this.feedsService.deleteFeed(this.updatedFeed);
        this.dismiss();
    };
    FeedInput.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    FeedInput = __decorate([
        core_1.Component({
            selector: 'feed-input',template:/*ion-inline-start:"/Users/310172519/git/sleeve-mvp-app/src/pages/feed-input/feed-input.html"*/'<ion-header>\n    <ion-toolbar>\n        <ion-title>\n            {{ selectedFeed ? \'Edit This Feed\' : \'Add A Feed\' }}\n        </ion-title>\n        <ion-buttons start>\n            <button ion-button (click)="dismiss()">\n                <span ion-text color="primary" showWhen="ios">Cancel</span>\n                <ion-icon name="md-close" showWhen="android,windows"></ion-icon>\n            </button>\n        </ion-buttons>\n    </ion-toolbar>\n</ion-header>\n\n<ion-content text-center>\n\n\n    <ion-label>\n            <h2><ion-icon name="water" color="{{ updatedFeed.type ==\'smart\' ? \'secondary\' : \'primary\'}}"></ion-icon> {{ (updatedFeed ? updatedFeed.amount : 125 )| number : \'1.0-0\' }} ml</h2></ion-label>\n    <ion-range min="0" max="250" step="5" snaps="true" color="primary" [(ngModel)]="updatedFeed.amount"></ion-range>\n\n\n    <button ion-button icon-start (click)="saveFeed()">\n        <ion-icon name="checkmark"></ion-icon>\n        Save\n    </button>\n\n    <button ion-button icon-start (click)="dismiss()">\n        <ion-icon name="close"></ion-icon>\n        Cancel\n    </button>\n\n\n    <button ion-button icon-start (click)="deleteFeed()" [hidden]="!selectedFeed">\n        <ion-icon name="trash"></ion-icon>\n        Delete\n    </button>\n\n\n</ion-content>'/*ion-inline-end:"/Users/310172519/git/sleeve-mvp-app/src/pages/feed-input/feed-input.html"*/
        }),
        __metadata("design:paramtypes", [ionic_angular_1.NavParams,
            ionic_angular_1.ViewController,
            feeds_1.Feeds,
            sessions_1.Sessions])
    ], FeedInput);
    return FeedInput;
}());
exports.FeedInput = FeedInput;
//# sourceMappingURL=feed-input.js.map

/***/ }),

/***/ 326:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var ionic_angular_1 = __webpack_require__(19);
var ionic_angular_2 = __webpack_require__(19);
var ble_1 = __webpack_require__(198);
var ionic_angular_3 = __webpack_require__(19);
var http_1 = __webpack_require__(103);
var ble_packet_parser_service_1 = __webpack_require__(327);
var Bluetooth = /** @class */ (function () {
    function Bluetooth(navCtrl, toastCtrl, ble, ngZone, alertCtrl, http, blePackageParser) {
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
        this.ble = ble;
        this.ngZone = ngZone;
        this.alertCtrl = alertCtrl;
        this.http = http;
        this.blePackageParser = blePackageParser;
        this.devices = [];
    }
    Bluetooth.prototype.sendFirmware = function (deviceId) {
        var _this = this;
        var firmwareUrl = 'assets/firmware/dummy.hex';
        var options = new http_1.RequestOptions({
            responseType: http_1.ResponseContentType.ArrayBuffer,
        });
        this.http.get(firmwareUrl, options)
            .subscribe(function (response) {
            if (response.ok) {
                var fileBuffer = response['_body'];
                var packages = _this.blePackageParser.bufferToPackages(fileBuffer);
                _this.startFwAckNotification(deviceId);
                _this.writePackages(deviceId, packages, 0, 0);
            }
        }, function (error) {
            _this.alertCtrl.create({
                title: 'Error loading the firmware',
                subTitle: error,
                buttons: ['Ok']
            }).present();
        });
    };
    Bluetooth.prototype.buf2hex = function (buffer) {
        return Array.prototype.map.call(new Uint8Array(buffer), function (x) { return ('00' + x.toString(16)).slice(-2); }).join('');
    };
    Bluetooth.prototype.ionViewDidEnter = function () {
        console.log('ionViewDidEnter');
        this.scan();
    };
    Bluetooth.prototype.connect = function (device) {
        var _this = this;
        console.log('connect to device');
        this.setStatus('Start connecting to ' + device.id);
        this.ble.connect(device.id).subscribe(function (peripheral) { return _this.onBleConnected(peripheral); }, function (peripheral) { return _this.onBleDisconnected(peripheral); });
    };
    Bluetooth.prototype.writePackages = function (deviceId, packages, packageCounter, retryCounter) {
        // for (let i = 0; i < packages.length; i++) {
        //   console.log('package to send:', i);
        //   this.ble.writeWithoutResponse(deviceId,
        //     '000030F1-0000-1000-8000-00805F9B34FB',
        //     '000063E8-0000-1000-8000-00805F9B34FB', packages[i])
        // }
        var _this = this;
        if (packageCounter >= packages.length) {
            return;
        }
        console.log('Write package', packageCounter, this.buf2hex(packages[packageCounter]));
        this.ble.write(deviceId, '000030F1-0000-1000-8000-00805F9B34FB', '000063E8-0000-1000-8000-00805F9B34FB', packages[packageCounter])
            .then(function (data) {
            _this.writePackages(deviceId, packages, ++packageCounter, retryCounter = 0);
        }).catch(function (error) {
            if (retryCounter >= 9) {
                _this.alertCtrl.create({
                    title: 'Error while sending firmware.',
                    subTitle: "I retried package" + packageCounter + " 10 times.",
                    buttons: ['Discard']
                }).present();
                return;
            }
            _this.writePackages(deviceId, packages, packageCounter, ++retryCounter);
        });
    };
    Bluetooth.prototype.writeLoop = function (deviceId, packageBuffer) {
    };
    Bluetooth.prototype.write = function (deviceId) {
        var _this = this;
        console.log('write to deviceId', deviceId);
        this.startNotification(deviceId);
        var valueJson = {
            name1: 'Lauren'
        };
        console.log('valueJson', valueJson);
        var valueString = JSON.stringify(valueJson);
        console.log('valueString', valueString);
        // valueString = "12345678901234567890";
        // valueString = '{"name":"Lauren"}';
        console.log(this);
        var valueBytes = this.stringToBytes(valueString);
        console.log('valueBytes', valueBytes);
        this.ble.write(deviceId, '000030f0-0000-1000-8000-00805f9b34fb', '000063e6-0000-1000-8000-00805f9b34fb', valueBytes)
            .then(function (data) {
            // this.alertCtrl.create({
            //   title: 'Successfully written',
            //   subTitle: valueString,
            //   buttons: ['Ok']
            // }).present();
        }).catch(function (error) {
            _this.alertCtrl.create({
                title: 'Error while writing',
                subTitle: 'error message: ' + JSON.stringify(error),
                buttons: ['Discard']
            }).present();
        });
    };
    Bluetooth.prototype.startFwAckNotification = function (deviceId) {
        var _this = this;
        this.ble.startNotification(deviceId, '000030F1-0000-1000-8000-00805F9B34FB', '000063E9-0000-1000-8000-00805F9B34FB').subscribe(function (data) {
            _this.alertCtrl.create({
                title: 'Successfully received firmware',
                subTitle: _this.buf2hex(data),
                buttons: ['Discard']
            }).present();
            // this.disconnect(deviceId)
        }, function (error) {
            _this.toastCtrl.create({
                message: 'Error on receiving firmware: ' + error,
                position: 'bottom',
                duration: 2000
            }).present();
        });
    };
    Bluetooth.prototype.startNotification = function (deviceId) {
        var _this = this;
        this.ble.startNotification(deviceId, '000030f0-0000-1000-8000-00805f9b34fb', '000063e7-0000-1000-8000-00805F9B34FB').subscribe(function (data) {
            _this.alertCtrl.create({
                title: 'Successfully received',
                subTitle: _this.bytesToString(data),
                buttons: ['Discard']
            }).present();
            // this.disconnect(deviceId)
        }, function (error) {
            _this.toastCtrl.create({
                message: 'Error on receiving: ' + error,
                position: 'bottom',
                duration: 2000
            }).present();
        });
    };
    Bluetooth.prototype.disconnect = function (device) {
        var _this = this;
        this.ble.disconnect(this.connectedDevice.id)
            .then(function (data) {
            _this.setStatus('BLE DISCONNECTED');
            _this.connectedDevice = null;
            _this.scan();
        })
            .catch(function (error) {
            _this.alertCtrl.create({
                title: 'Error in disconnecting',
                subTitle: error,
                buttons: ['Discard']
            }).present();
        });
    };
    // ASCII only
    Bluetooth.prototype.stringToBytes = function (string) {
        var array = new Uint8Array(string.length);
        for (var i = 0, l = string.length; i < l; i++) {
            array[i] = string.charCodeAt(i);
        }
        return array.buffer;
    };
    // ASCII only
    Bluetooth.prototype.bytesToString = function (buffer) {
        return String.fromCharCode.apply(null, new Uint8Array(buffer));
    };
    Bluetooth.prototype.forceBonding = function (peripheral) {
        this.ble.read(peripheral.id, peripheral.characteristics[0].service, peripheral.characteristics[0].characteristic).then();
    };
    Bluetooth.prototype.onBleConnected = function (peripheral) {
        this.connectedDevice = peripheral;
        this.forceBonding(peripheral);
        this.setStatus('BLE CONNECTED');
    };
    Bluetooth.prototype.onBleDisconnected = function (peripheral) {
        this.alertCtrl.create({
            title: 'Error while connecting',
            subTitle: JSON.stringify(peripheral),
            buttons: ['Dismiss']
        }).present();
        console.log(JSON.stringify(peripheral));
        // this.setStatus('BLE DISCONNECTED via callback');
    };
    Bluetooth.prototype.scan = function () {
        var _this = this;
        // this.setStatus('Scanning for Bluetooth LE Devices');
        this.devices = []; // clear list
        this.ble.scan([], 5).subscribe(function (device) { return _this.onDeviceDiscovered(device); }, function (error) { return _this.scanError(error); });
        // setTimeout(this.setStatus.bind(this), 5000, 'Scan complete');
    };
    Bluetooth.prototype.onDeviceDiscovered = function (device) {
        var _this = this;
        console.log('Discovered ' + JSON.stringify(device, null, 2));
        this.ngZone.run(function () {
            _this.devices.push(device);
        });
    };
    // If location permission is denied, you'll end up here
    Bluetooth.prototype.scanError = function (error) {
        this.setStatus('Error ' + error);
        // let toast = this.toastCtrl.create({
        //   message: 'Error scanning for Bluetooth low energy devices',
        //   position: 'middle',
        //   duration: 1000
        // });
        // toast.present();
    };
    Bluetooth.prototype.setStatus = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            position: 'bottom',
            duration: 1000
        });
        toast.present();
        console.log(message);
        // this.ngZone.run(() => {
        //   this.statusMessage = message;
        // });
    };
    Bluetooth = __decorate([
        core_1.Component({
            selector: 'bluetooth',template:/*ion-inline-start:"/Users/310172519/git/sleeve-mvp-app/src/pages/bluetooth/bluetooth.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>\n            Bluetooth Settings\n        </ion-title>\n        <ion-buttons end>\n            <button ion-button (click)="scan();fakeScan=true;">\n                Scan\n            </button>\n        </ion-buttons>\n    </ion-navbar>\n</ion-header>\n\n<ion-content>\n    <ion-list>\n        <div *ngIf="connectedDevice">\n            <button ion-item (click)="write(connectedDevice.id)">\n                Resend data\n            </button>\n            <button ion-item (click)="sendFirmware(connectedDevice.id)">\n                Send firmware\n            </button>\n            <button *ngIf="connectedDevice" ion-item (click)="disconnect(connectedDevice)">\n                Disconnect\n            </button>\n        </div>\n        <div *ngIf="!connectedDevice">\n            <div *ngFor="let device of devices">\n                <button ion-item (click)="connect(device)">\n                    <h2>{{ device.name || \'Unnamed\' }}</h2>\n                    <p>{{ device.id }}</p>\n                    <p>RSSI: {{ device.rssi }}</p>\n                </button>\n            </div>\n\n        </div>\n    </ion-list>\n</ion-content>\n\n<!-- <ion-footer>\n    <ion-toolbar>\n        <p>{{ statusMessage }}</p>\n    </ion-toolbar>\n</ion-footer> -->'/*ion-inline-end:"/Users/310172519/git/sleeve-mvp-app/src/pages/bluetooth/bluetooth.html"*/
        }),
        __metadata("design:paramtypes", [ionic_angular_1.NavController,
            ionic_angular_2.ToastController,
            ble_1.BLE,
            core_1.NgZone,
            ionic_angular_3.AlertController,
            http_1.Http,
            ble_packet_parser_service_1.BlePacketParser])
    ], Bluetooth);
    return Bluetooth;
}());
exports.Bluetooth = Bluetooth;
//# sourceMappingURL=bluetooth.js.map

/***/ }),

/***/ 327:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var BlePacketParser = /** @class */ (function () {
    function BlePacketParser() {
        this.BLE_PACKAGE_SIZE = 20; //Bytes
        this.BLE_HEADER_SIZE = 4; //Bytes
        this.BLE_PAYLOAD_SIZE = this.BLE_PACKAGE_SIZE - this.BLE_HEADER_SIZE;
    }
    BlePacketParser.prototype.bufferToPackages = function (payloadBuffer) {
        var outputPackages = [];
        console.log(outputPackages);
        var amountOfPackages = Math.ceil(payloadBuffer.byteLength / this.BLE_PAYLOAD_SIZE);
        for (var packageCount = 0; packageCount < amountOfPackages; packageCount++) {
            var packageCountDown = amountOfPackages - packageCount - 1;
            // console.log('packageCountDown', packageCountDown)
            var byteCount = packageCount * this.BLE_PAYLOAD_SIZE;
            var packagePayloadBuffer = payloadBuffer.slice(byteCount, byteCount + this.BLE_PAYLOAD_SIZE);
            var packagePayloadBytes = new Uint8Array(packagePayloadBuffer);
            var packageHeaderBytes = new Uint8Array(this.BLE_HEADER_SIZE);
            var controlBytes = this.hexToBuffer('42');
            packageHeaderBytes.set(new Uint8Array(controlBytes), 0);
            var stopByte = packageCount == 0 ? 2 : (packageCount == (amountOfPackages - 1)) ? 0 : 1;
            var stopByteArray = new Uint8Array(2);
            stopByteArray[0] = stopByte;
            packageHeaderBytes.set(stopByteArray, 1);
            var counterBuffer = new ArrayBuffer(2);
            var counterView = new DataView(counterBuffer, 0);
            counterView.setInt16(0, packageCountDown);
            packageHeaderBytes.set(new Uint8Array(counterBuffer), 2);
            var packageBytes = new Uint8Array(this.BLE_PACKAGE_SIZE);
            packageBytes.set(packageHeaderBytes, 0);
            packageBytes.set(packagePayloadBytes, 4);
            // console.log(this.bufferToHex(packageBytes.buffer))
            outputPackages.push(packageBytes.buffer);
        }
        return outputPackages;
    };
    BlePacketParser.prototype.bufferToHex = function (buffer) {
        return Array.prototype.map.call(new Uint8Array(buffer), function (x) { return ('00' + x.toString(16)).slice(-2); }).join('');
    };
    BlePacketParser.prototype.hexToBuffer = function (hex) {
        var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
            return parseInt(h, 16);
        }));
        return typedArray.buffer;
    };
    BlePacketParser = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], BlePacketParser);
    return BlePacketParser;
}());
exports.BlePacketParser = BlePacketParser;
//# sourceMappingURL=ble-packet-parser.service.js.map

/***/ }),

/***/ 328:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var platform_browser_dynamic_1 = __webpack_require__(329);
var app_module_1 = __webpack_require__(352);
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 352:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var platform_browser_1 = __webpack_require__(28);
var core_1 = __webpack_require__(0);
var ionic_angular_1 = __webpack_require__(19);
var splash_screen_1 = __webpack_require__(195);
var status_bar_1 = __webpack_require__(197);
var ble_1 = __webpack_require__(198);
var http_1 = __webpack_require__(103);
var app_component_1 = __webpack_require__(403);
var tabs_1 = __webpack_require__(199);
var timeline_1 = __webpack_require__(200);
var bluetooth_1 = __webpack_require__(326);
var feed_input_1 = __webpack_require__(320);
var feeds_1 = __webpack_require__(104);
var sessions_1 = __webpack_require__(53);
var device_1 = __webpack_require__(325);
var ble_packet_parser_service_1 = __webpack_require__(327);
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.MyApp,
                tabs_1.Tabs,
                timeline_1.Timeline,
                bluetooth_1.Bluetooth,
                feed_input_1.FeedInput
            ],
            imports: [
                platform_browser_1.BrowserModule,
                ionic_angular_1.IonicModule.forRoot(app_component_1.MyApp, {}, {
                    links: []
                }),
                http_1.HttpModule
            ],
            bootstrap: [ionic_angular_1.IonicApp],
            entryComponents: [
                app_component_1.MyApp,
                tabs_1.Tabs,
                timeline_1.Timeline,
                bluetooth_1.Bluetooth,
                feed_input_1.FeedInput
            ],
            providers: [
                status_bar_1.StatusBar,
                splash_screen_1.SplashScreen,
                { provide: core_1.ErrorHandler, useClass: ionic_angular_1.IonicErrorHandler },
                ble_1.BLE,
                ble_packet_parser_service_1.BlePacketParser,
                feeds_1.Feeds,
                sessions_1.Sessions,
                device_1.Device
            ]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 403:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var ionic_angular_1 = __webpack_require__(19);
var status_bar_1 = __webpack_require__(197);
var splash_screen_1 = __webpack_require__(195);
var tabs_1 = __webpack_require__(199);
var sessions_1 = __webpack_require__(53);
var MyApp = /** @class */ (function () {
    function MyApp(platform, statusBar, splashScreen, sessionsService) {
        this.rootPage = tabs_1.Tabs;
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            if (platform.is('cordova')) {
                statusBar.styleDefault();
                splashScreen.hide();
            }
            sessionsService.setSession();
        });
    }
    MyApp = __decorate([
        core_1.Component({template:/*ion-inline-start:"/Users/310172519/git/sleeve-mvp-app/src/app/app.html"*/'<ion-nav [root]="rootPage"></ion-nav>\n'/*ion-inline-end:"/Users/310172519/git/sleeve-mvp-app/src/app/app.html"*/
        }),
        __metadata("design:paramtypes", [ionic_angular_1.Platform, status_bar_1.StatusBar, splash_screen_1.SplashScreen, sessions_1.Sessions])
    ], MyApp);
    return MyApp;
}());
exports.MyApp = MyApp;
//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 405:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./af": 201,
	"./af.js": 201,
	"./ar": 202,
	"./ar-dz": 203,
	"./ar-dz.js": 203,
	"./ar-kw": 204,
	"./ar-kw.js": 204,
	"./ar-ly": 205,
	"./ar-ly.js": 205,
	"./ar-ma": 206,
	"./ar-ma.js": 206,
	"./ar-sa": 207,
	"./ar-sa.js": 207,
	"./ar-tn": 208,
	"./ar-tn.js": 208,
	"./ar.js": 202,
	"./az": 209,
	"./az.js": 209,
	"./be": 210,
	"./be.js": 210,
	"./bg": 211,
	"./bg.js": 211,
	"./bm": 212,
	"./bm.js": 212,
	"./bn": 213,
	"./bn.js": 213,
	"./bo": 214,
	"./bo.js": 214,
	"./br": 215,
	"./br.js": 215,
	"./bs": 216,
	"./bs.js": 216,
	"./ca": 217,
	"./ca.js": 217,
	"./cs": 218,
	"./cs.js": 218,
	"./cv": 219,
	"./cv.js": 219,
	"./cy": 220,
	"./cy.js": 220,
	"./da": 221,
	"./da.js": 221,
	"./de": 222,
	"./de-at": 223,
	"./de-at.js": 223,
	"./de-ch": 224,
	"./de-ch.js": 224,
	"./de.js": 222,
	"./dv": 225,
	"./dv.js": 225,
	"./el": 226,
	"./el.js": 226,
	"./en-au": 227,
	"./en-au.js": 227,
	"./en-ca": 228,
	"./en-ca.js": 228,
	"./en-gb": 229,
	"./en-gb.js": 229,
	"./en-ie": 230,
	"./en-ie.js": 230,
	"./en-nz": 231,
	"./en-nz.js": 231,
	"./eo": 232,
	"./eo.js": 232,
	"./es": 233,
	"./es-do": 234,
	"./es-do.js": 234,
	"./es-us": 235,
	"./es-us.js": 235,
	"./es.js": 233,
	"./et": 236,
	"./et.js": 236,
	"./eu": 237,
	"./eu.js": 237,
	"./fa": 238,
	"./fa.js": 238,
	"./fi": 239,
	"./fi.js": 239,
	"./fo": 240,
	"./fo.js": 240,
	"./fr": 241,
	"./fr-ca": 242,
	"./fr-ca.js": 242,
	"./fr-ch": 243,
	"./fr-ch.js": 243,
	"./fr.js": 241,
	"./fy": 244,
	"./fy.js": 244,
	"./gd": 245,
	"./gd.js": 245,
	"./gl": 246,
	"./gl.js": 246,
	"./gom-latn": 247,
	"./gom-latn.js": 247,
	"./gu": 248,
	"./gu.js": 248,
	"./he": 249,
	"./he.js": 249,
	"./hi": 250,
	"./hi.js": 250,
	"./hr": 251,
	"./hr.js": 251,
	"./hu": 252,
	"./hu.js": 252,
	"./hy-am": 253,
	"./hy-am.js": 253,
	"./id": 254,
	"./id.js": 254,
	"./is": 255,
	"./is.js": 255,
	"./it": 256,
	"./it.js": 256,
	"./ja": 257,
	"./ja.js": 257,
	"./jv": 258,
	"./jv.js": 258,
	"./ka": 259,
	"./ka.js": 259,
	"./kk": 260,
	"./kk.js": 260,
	"./km": 261,
	"./km.js": 261,
	"./kn": 262,
	"./kn.js": 262,
	"./ko": 263,
	"./ko.js": 263,
	"./ky": 264,
	"./ky.js": 264,
	"./lb": 265,
	"./lb.js": 265,
	"./lo": 266,
	"./lo.js": 266,
	"./lt": 267,
	"./lt.js": 267,
	"./lv": 268,
	"./lv.js": 268,
	"./me": 269,
	"./me.js": 269,
	"./mi": 270,
	"./mi.js": 270,
	"./mk": 271,
	"./mk.js": 271,
	"./ml": 272,
	"./ml.js": 272,
	"./mr": 273,
	"./mr.js": 273,
	"./ms": 274,
	"./ms-my": 275,
	"./ms-my.js": 275,
	"./ms.js": 274,
	"./mt": 276,
	"./mt.js": 276,
	"./my": 277,
	"./my.js": 277,
	"./nb": 278,
	"./nb.js": 278,
	"./ne": 279,
	"./ne.js": 279,
	"./nl": 280,
	"./nl-be": 281,
	"./nl-be.js": 281,
	"./nl.js": 280,
	"./nn": 282,
	"./nn.js": 282,
	"./pa-in": 283,
	"./pa-in.js": 283,
	"./pl": 284,
	"./pl.js": 284,
	"./pt": 285,
	"./pt-br": 286,
	"./pt-br.js": 286,
	"./pt.js": 285,
	"./ro": 287,
	"./ro.js": 287,
	"./ru": 288,
	"./ru.js": 288,
	"./sd": 289,
	"./sd.js": 289,
	"./se": 290,
	"./se.js": 290,
	"./si": 291,
	"./si.js": 291,
	"./sk": 292,
	"./sk.js": 292,
	"./sl": 293,
	"./sl.js": 293,
	"./sq": 294,
	"./sq.js": 294,
	"./sr": 295,
	"./sr-cyrl": 296,
	"./sr-cyrl.js": 296,
	"./sr.js": 295,
	"./ss": 297,
	"./ss.js": 297,
	"./sv": 298,
	"./sv.js": 298,
	"./sw": 299,
	"./sw.js": 299,
	"./ta": 300,
	"./ta.js": 300,
	"./te": 301,
	"./te.js": 301,
	"./tet": 302,
	"./tet.js": 302,
	"./th": 303,
	"./th.js": 303,
	"./tl-ph": 304,
	"./tl-ph.js": 304,
	"./tlh": 305,
	"./tlh.js": 305,
	"./tr": 306,
	"./tr.js": 306,
	"./tzl": 307,
	"./tzl.js": 307,
	"./tzm": 308,
	"./tzm-latn": 309,
	"./tzm-latn.js": 309,
	"./tzm.js": 308,
	"./uk": 310,
	"./uk.js": 310,
	"./ur": 311,
	"./ur.js": 311,
	"./uz": 312,
	"./uz-latn": 313,
	"./uz-latn.js": 313,
	"./uz.js": 312,
	"./vi": 314,
	"./vi.js": 314,
	"./x-pseudo": 315,
	"./x-pseudo.js": 315,
	"./yo": 316,
	"./yo.js": 316,
	"./zh-cn": 317,
	"./zh-cn.js": 317,
	"./zh-hk": 318,
	"./zh-hk.js": 318,
	"./zh-tw": 319,
	"./zh-tw.js": 319
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 405;

/***/ }),

/***/ 53:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var pouchdb_1 = __webpack_require__(321);
var device_1 = __webpack_require__(325);
var Sessions = /** @class */ (function () {
    function Sessions(device) {
        this.device = device;
        this.dbName = 'sessions';
        this.localDb = new pouchdb_1.default(this.dbName);
        this.remoteDb = 'http://ec2-34-239-163-2.compute-1.amazonaws.com:5984/' + this.dbName;
        this.localDb.replicate.to(this.remoteDb, {
            live: true,
            retry: true,
            continuous: true,
        });
    }
    Sessions.prototype.getSessionId = function () {
        if (this.session) {
            return this.session._id;
        }
        return 'unknown session';
    };
    Sessions.prototype.setSession = function () {
        var _this = this;
        this.localDb.allDocs({
            include_docs: true
        }).then(function (result) {
            if (!result || result.total_rows < 1) {
                _this.createSession();
            }
            else if (result.total_rows > 1) {
                console.error('DETECTED MULTIPLE SESSIONS RESETTING');
                _this.clearDatabase();
            }
            else {
                console.log('existing session', JSON.stringify(result));
                _this.session = result.rows[0] || {};
            }
        });
    };
    Sessions.prototype.clearDatabase = function () {
        var _this = this;
        this.localDb.destroy().then(function () {
            _this.localDb = new pouchdb_1.default(_this.dbName);
            _this.createSession();
        });
    };
    Sessions.prototype.createSession = function () {
        var _this = this;
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
        this.localDb.post(this.session).then(function (result) {
            _this.session = result;
        }).catch(function (err) {
            console.error(JSON.stringify(err));
        });
        return this.session;
    };
    Sessions = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [device_1.Device])
    ], Sessions);
    return Sessions;
}());
exports.Sessions = Sessions;
//# sourceMappingURL=sessions.js.map

/***/ })

},[328]);
//# sourceMappingURL=main.js.map