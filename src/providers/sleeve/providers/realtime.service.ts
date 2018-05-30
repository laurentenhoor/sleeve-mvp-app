import { Injectable } from '@angular/core';
import { BLE } from "@ionic-native/ble";
import { Observable } from 'rxjs/Observable';
import { ConnectService } from './connect.service';

@Injectable()
export class RealtimeService {

    constructor(
        private ble: BLE,
        private connectService: ConnectService
    ) {

    }

    angle(): Observable<any> {
        return Observable.create((observer) => {

            if (!this.connectService.connectedDeviceId){
                observer.error('not connected to any device');
            }

            this.ble.startNotification(
                this.connectService.connectedDeviceId,
                '000030F1-0000-1000-8000-00805F9B34FB',
                '000063E8-0000-1000-8000-00805F9B34FB'
            ).subscribe(data => {
                var dataView = new DataView(data, 0);
                let value = dataView.getInt8(0);
                observer.next(value);
            }, error => {
                console.error('state', error);
                observer.error('receiving state');
            })
        });
    }

    state(): Observable<any> {
        return Observable.create(observer => {

            if (!this.connectService.connectedDeviceId){
                observer.error('not connected to any device');
            }
            
            this.ble.startNotification(
                this.connectService.connectedDeviceId,
                '000030f3-0000-1000-8000-00805f9b34fb',
                '000063eC-0000-1000-8000-00805f9b34fb'
            ).subscribe(data => {
                let value = this.bufferToHex(data);
                let decimalValue = parseInt(value, 16);
                observer.next(decimalValue)
            }, error => {
                console.error('state', error);
                observer.error('receiving state');
            })
        })
    }

    private bufferToHex(buffer: ArrayBuffer) {
        return Array.prototype.map.call(new Uint16Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
    }
}