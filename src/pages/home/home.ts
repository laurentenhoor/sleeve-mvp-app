import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';

import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  devices: any[] = [];
  statusMessage: string;
  connectedDeviceId: string;

  constructor(public navCtrl: NavController,
    private toastCtrl: ToastController,
    private ble: BLE,
    private ngZone: NgZone,
    private alertCtrl: AlertController) {

    this.write('testDeviceId');
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter');
    this.scan();
  }

  connect(device) {
    console.log('connect to device')

    this.setStatus(device.id);

    this.ble.connect(device.id).subscribe(
      peripheral => this.onBleConnected(peripheral),
      peripheral => this.onBleDisconnected(peripheral)
    )

  }


  write(deviceId) {

    console.log('write to deviceId', deviceId)

    let valueJson = {
      name1: 'Lauren'
    };
    console.log('valueJson', valueJson)

    let valueString = JSON.stringify(valueJson);
    console.log('valueString', valueString);
    
    // valueString = "12345678901234567890";
    // valueString = '{"name":"Lauren"}';

    let valueBytes = this.stringToBytes(valueString)
    console.log('valueBytes', valueBytes);
    console.log('valueBytes', new Uint8Array(8).buffer)

    this.toastCtrl.create({
      message: 'Byte Size: ' + valueBytes.byteLength,
      position: 'top',
      duration: 2000
    }).present();

    this.ble.write(deviceId, '000030f0-0000-1000-8000-00805f9b34fb', '000063e6-0000-1000-8000-00805f9b34fb', valueBytes)
      .then(data => {
        this.alertCtrl.create({
          title: 'Successful write',
          subTitle: data,
          buttons: ['Ok']
        }).present();
      }).catch(error => {
        this.alertCtrl.create({
          title: 'Error while writing',
          subTitle: 'error message: ' + JSON.stringify(error),
          buttons: ['Discard']
        }).present()
      });

  }

  disconnect(device) {
    this.ble.disconnect(device.id)
      .then(succes => {
        this.connectedDeviceId = null;
      }, error => {
        this.alertCtrl.create({
          title: 'Error in disconnecting',
          subTitle: error,
          buttons: ['Discard']
        }).present();
      })
  }

  // ASCII only
  stringToBytes(string) {
    var array = new Uint8Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
      array[i] = string.charCodeAt(i);
    }
    return array.buffer;
  }

  // ASCII only
  bytesToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
  }


  onBleConnected(peripheral) {
    this.setStatus('BLE CONNECTED')
    this.connectedDeviceId = peripheral.id;
    this.write(peripheral.id)
  }

  onBleDisconnected(peripheral) {
    this.setStatus('BLE DISCONNECTED');
    // this.alertCtrl.create({
    //   title: peripheral.name,
    //   subTitle: peripheral.id,
    //   buttons: ['Cancel']
    // }).present();
  }

  scan() {
    this.setStatus('Scanning for Bluetooth LE Devices');
    this.devices = [];  // clear list

    this.ble.scan([], 5).subscribe(
      device => this.onDeviceDiscovered(device),
      error => this.scanError(error)
    );

    setTimeout(this.setStatus.bind(this), 5000, 'Scan complete');
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
    let toast = this.toastCtrl.create({
      message: 'Error scanning for Bluetooth low energy devices',
      position: 'middle',
      duration: 5000
    });
    toast.present();
  }

  setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }

}