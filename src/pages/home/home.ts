import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';

import { AlertController } from 'ionic-angular';

import { Http } from '@angular/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  devices: any[] = [];
  statusMessage: string;
  connectedDeviceId: string;
  firmware: ArrayBuffer

  constructor(public navCtrl: NavController,
    private toastCtrl: ToastController,
    private ble: BLE,
    private ngZone: NgZone,
    private alertCtrl: AlertController,
    private http: Http) {
    // this.loadFirmware('../assets/icon/favicon.ico');
  }

  loadFirmware(url: string) {
    this.http.get(url)
      .subscribe(
        response => {
          if (response.ok) {
            let fileContentString = response['_body'];
            console.log(fileContentString)
            if (fileContentString) {
              this.firmware = this.stringToBytes(fileContentString);
              console.log(this.firmware)
              console.log()

              // this.toastCtrl.create({
              //   message: 'Successfully loaded the firmware',
              //   position: 'top',
              //   duration: 2000
              // }).present();

              this.alertCtrl.create({
                title: 'Successfull loaded firmware',
                subTitle: 'First 12 Bytes: '+ this.buf2hex(this.firmware.slice(0, 12)),
                buttons: ['Ok']
              }).present();
              

            }
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

    console.log(this);

    let valueBytes = this.stringToBytes(valueString)

    console.log('valueBytes', valueBytes);

    this.toastCtrl.create({
      message: 'Byte Size: ' + valueBytes.byteLength,
      position: 'top',
      duration: 2000
    }).present();

    this.ble.write(deviceId,
      '000030f0-0000-1000-8000-00805f9b34fb',
      '000063e6-0000-1000-8000-00805f9b34fb',
      valueBytes)
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

  receivePackage(data) {

  }

  startNotification(deviceId) {
    this.ble.startNotification(deviceId,
      '000030f0-0000-1000-8000-00805f9b34fb',
      '000063e6-0000-1000-8000-00805f9b34fb'
    ).subscribe(data => {
      this.receivePackage(data);
      this.toastCtrl.create({
        message: 'Data available: ' + data,
        position: 'top',
        duration: 2000
      }).present();
    }, error => {
      this.toastCtrl.create({
        message: 'Data available: ' + error,
        position: 'top',
        duration: 2000
      }).present();
    })

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