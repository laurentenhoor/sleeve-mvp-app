# Smart Bottle Tracker Native Mobile Applications
Target platforms: iOS and Android.
Written in Angular and Ionic. CouchDB database with PouchDB offline first persistent database.

This project is about app connecting to the following sleeve firmware: [https://bitbucket.com/sleeve-mvp/sleeve-mvp-firmware](https://bitbucket.com/sleeve-mvp/sleeve-mvp-firmware).

# Changelog
## Version 0.1.0
*   Back-end infrastructure changed to CouchDB and PouchDB (offline first persistent local database)
    * [https://www.joshmorony.com/offline-syncing-in-ionic-2-with-pouchdb-couchdb/](https://www.joshmorony.com/offline-syncing-in-ionic-2-with-pouchdb-couchdb/)

## Version 0.0.4
*   Bonding from the app works on both iOS and Android.
    * Android needs to read a characteristic to force bonding [https://github.com/don/cordova-plugin-ble-central/issues/127#issuecomment-167808782](https://github.com/don/cordova-plugin-ble-central/issues/127#issuecomment-167808782)
*   Build Android not working aapt error
    Solution can be found [https://forum.ionicframework.com/t/build-break-with-aapt-error-message-why/123955/6](https://forum.ionicframework.com/t/build-break-with-aapt-error-message-why/123955/6)

## Version 0.0.3
*   Implemented BLE Transport Protocol
    *   Successfully sended a dummy firmware file.

## Version 0.0.2
*   Improved BLE
    *   Implemented acknowledgement
*   Added Meteor back-end
*   Feeding Journal
    *   Add feeds manual
    *   Mock-up of data transfer/synchronization - with feed generator
*   Tested with sleeve firmware commit [97fd634f064e2f0de16a925df1d267512bd997bb](https://github.com/shreyas2415/SBS_Shrey/tree/97fd634f064e2f0de16a925df1d267512bd997bb)
    *   iOS 10, 11 and Android 7 

## Version 0.0.1
*   Initial application: bluetooth scanner with Philips branding.