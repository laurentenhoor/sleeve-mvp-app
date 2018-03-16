import { Component, NgZone, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';

import { AlertController } from 'ionic-angular';

import { Http, RequestOptions, ResponseContentType } from '@angular/http';
import { BlePacketParser } from './ble-packet-parser.service';

@Component({
  selector: 'bluetooth',
  templateUrl: 'bluetooth.html'
})
export class Bluetooth {

  devices: any[] = [];
  statusMessage: string;
  firmware: ArrayBuffer;
  connectedDevice;

  constructor(public navCtrl: NavController,
    private toastCtrl: ToastController,
    private ble: BLE,
    private ngZone: NgZone,
    private alertCtrl: AlertController,
    private http: Http,
    private blePackageParser: BlePacketParser) {
  }

  sendFirmware(deviceId: string) {

    var firmwareUrl = 'assets/firmware/dummy.hex'

    var options = new RequestOptions({
      responseType: ResponseContentType.ArrayBuffer,
    });

    this.http.get(firmwareUrl, options)
      .subscribe(
        response => {
          if (response.ok) {
            let fileBuffer: ArrayBuffer = response['_body'];

            let packages = this.blePackageParser.bufferToPackages(fileBuffer);
            this.startFwAckNotification(deviceId);
            this.writePackages(deviceId, packages, 0, 0);

          }
        },
        error => {
          this.alertCtrl.create({
            title: 'Error loading the firmware',
            subTitle: error,
            buttons: ['Ok']
          }).present();
        })
  }

  buf2hex(buffer: ArrayBuffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter');
    this.scan();
  }

  connect(device) {
    console.log('connect to device')

    this.setStatus('Start connecting to ' + device.id);

    this.ble.connect(device.id).subscribe(
      peripheral => this.onBleConnected(peripheral),
      peripheral => this.onBleDisconnected(peripheral)
    )

  }

  writePackages(deviceId: string, packages: ArrayBuffer[], packageCounter: number, retryCounter: number) {
    // for (let i = 0; i < packages.length; i++) {
    //   console.log('package to send:', i);
    //   this.ble.writeWithoutResponse(deviceId,
    //     '000030F1-0000-1000-8000-00805F9B34FB',
    //     '000063E8-0000-1000-8000-00805F9B34FB', packages[i])
    // }

    if (packageCounter >= packages.length) {
      return;
    }

    console.log('Write package', packageCounter, this.buf2hex(packages[packageCounter]))

    this.ble.write(deviceId,
      '000030F1-0000-1000-8000-00805F9B34FB',
      '000063E8-0000-1000-8000-00805F9B34FB',
      packages[packageCounter]
    )
      .then(data => {
        this.writePackages(deviceId, packages, ++packageCounter, retryCounter = 0)
      }).catch(error => {
        if (retryCounter >= 9) {
          this.alertCtrl.create({
            title: 'Error while sending firmware.',
            subTitle: "I retried package" + packageCounter + " 10 times.",
            buttons: ['Discard']
          }).present();
          return;
        }
        this.writePackages(deviceId, packages, packageCounter, ++retryCounter);
      });
  }

  writeLoop(deviceId: string, packageBuffer: ArrayBuffer) {

  }

  write(deviceId) {

    console.log('write to deviceId', deviceId);
    this.startNotification(deviceId);

    let valueJson = {
      name1: 'Lauren'
    };
    console.log('valueJson', valueJson)

    let valueString = JSON.stringify(valueJson);
    console.log('valueString', valueString);

    // valueString = "12345678901234567890";
    // valueString = '{"name":"Lauren"}';

    console.log(this);

    let valueBytes = this.stringToBytes(valueString)

    console.log('valueBytes', valueBytes);

    this.ble.write(deviceId,
      '000030f0-0000-1000-8000-00805f9b34fb',
      '000063e6-0000-1000-8000-00805f9b34fb',
      valueBytes)
      .then(data => {
        // this.alertCtrl.create({
        //   title: 'Successfully written',
        //   subTitle: valueString,
        //   buttons: ['Ok']
        // }).present();
      }).catch(error => {
        this.alertCtrl.create({
          title: 'Error while writing',
          subTitle: 'error message: ' + JSON.stringify(error),
          buttons: ['Discard']
        }).present()
      });

  }

  startFwAckNotification(deviceId: string) {
    this.ble.startNotification(deviceId,
      '000030F1-0000-1000-8000-00805F9B34FB',
      '000063E9-0000-1000-8000-00805F9B34FB'
    ).subscribe(data => {
      this.alertCtrl.create({
        title: 'Successfully received firmware',
        subTitle: this.buf2hex(data),
        buttons: ['Discard']
      }).present();
      // this.disconnect(deviceId)
    }, error => {
      this.toastCtrl.create({
        message: 'Error on receiving firmware: ' + error,
        position: 'bottom',
        duration: 2000
      }).present();
    })
  }

  startNotification(deviceId) {
    this.ble.startNotification(deviceId,
      '000030f0-0000-1000-8000-00805f9b34fb',
      '000063e7-0000-1000-8000-00805F9B34FB'
    ).subscribe(data => {
      this.alertCtrl.create({
        title: 'Successfully received',
        subTitle: this.bytesToString(data),
        buttons: ['Discard']
      }).present();
      // this.disconnect(deviceId)
    }, error => {
      this.toastCtrl.create({
        message: 'Error on receiving: ' + error,
        position: 'bottom',
        duration: 2000
      }).present();
    })

  }


  disconnect(device) {

    this.ble.disconnect(this.connectedDevice.id)
      .then(data => {
        this.setStatus('BLE DISCONNECTED');
        this.connectedDevice = null;
        this.scan();
      })
      .catch(error => {
        this.alertCtrl.create({
          title: 'Error in disconnecting',
          subTitle: error,
          buttons: ['Discard']
        }).present();
      })

  }

  // ASCII only
  stringToBytes(string) {
    let array = new Uint8Array(string.length);
    for (let i = 0, l = string.length; i < l; i++) {
      array[i] = string.charCodeAt(i);
    }
    return array.buffer;
  }

  // ASCII only
  bytesToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
  }

  forceBonding(peripheral) {
    this.ble.read(peripheral.id,
      peripheral.characteristics[0].service,
      peripheral.characteristics[0].characteristic).then(
        // data => console.log(data),
        // error => console.error(error)
      )

  }

  onBleConnected(peripheral) {
    this.connectedDevice = peripheral;
    this.forceBonding(peripheral)
    this.setStatus('BLE CONNECTED')
  }

  onBleDisconnected(peripheral) {
    this.alertCtrl.create({
      title: 'Error while connecting',
      subTitle: JSON.stringify(peripheral),
      buttons: ['Dismiss']
    }).present();

    console.log(JSON.stringify(peripheral))

    // this.setStatus('BLE DISCONNECTED via callback');
  }

  scan() {
    // this.setStatus('Scanning for Bluetooth LE Devices');
    this.devices = [];  // clear list

    this.ble.scan([], 5).subscribe(
      device => this.onDeviceDiscovered(device),
      error => this.scanError(error)
    );

    // setTimeout(this.setStatus.bind(this), 5000, 'Scan complete');
  }

  onDeviceDiscovered(device) {
    console.log('Discovered ' + JSON.stringify(device, null, 2));
    this.ngZone.run(() => {
      this.devices.push(device);
    });
  }

  // If location permission is denied, you'll end up here
  scanError(error) {
    this.setStatus('Error ' + error);
    // let toast = this.toastCtrl.create({
    //   message: 'Error scanning for Bluetooth low energy devices',
    //   position: 'middle',
    //   duration: 1000
    // });
    // toast.present();
  }

  setStatus(message) {

    let toast = this.toastCtrl.create({
      message: message,
      position: 'bottom',
      duration: 1000
    });
    toast.present();

    console.log(message);
    // this.ngZone.run(() => {
    //   this.statusMessage = message;
    // });
  }

}