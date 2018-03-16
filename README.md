# Smart Bottle Tracker Native Mobile Applications
Target platforms: iOS and Android.
Written in Angular and Ionic. Meteor back-end via DDP.

This project is about app connecting to the following sleeve firmware: [https://github.com/shreyas2415/SBS_Shrey](https://github.com/shreyas2415/SBS_Shrey).

# Changelog
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