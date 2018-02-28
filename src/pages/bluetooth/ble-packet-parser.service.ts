import { Injectable } from '@angular/core';

@Injectable()
export class BlePacketParser {
    private BLE_PACKAGE_SIZE = 20;//Bytes
    private BLE_HEADER_SIZE = 4;//Bytes
    private BLE_PAYLOAD_SIZE = this.BLE_PACKAGE_SIZE - this.BLE_HEADER_SIZE;

    constructor() { }

    bufferToPackages(payloadBuffer: ArrayBuffer) {
        var outputPackages: ArrayBuffer[] = [];
        console.log(outputPackages)

        var amountOfPackages = Math.ceil(payloadBuffer.byteLength / this.BLE_PAYLOAD_SIZE)
        
        for (let packageCount = 0; packageCount < amountOfPackages; packageCount++) {
            let packageCountDown = amountOfPackages-packageCount-1;
            // console.log('packageCountDown', packageCountDown)

            let byteCount = packageCount * this.BLE_PAYLOAD_SIZE
            let packagePayloadBuffer = payloadBuffer.slice(byteCount, byteCount + this.BLE_PAYLOAD_SIZE)
            let packagePayloadBytes = new Uint8Array(packagePayloadBuffer);

            let packageHeaderBytes = new Uint8Array(this.BLE_HEADER_SIZE)
        
            let controlBytes = this.hexToBuffer('42');
            packageHeaderBytes.set(new Uint8Array(controlBytes), 0)

            let stopByte = packageCount == 0 ? 2 : (packageCount == (amountOfPackages-1)) ? 0 : 1;
            let stopByteArray = new Uint8Array(2);
            stopByteArray[0] = stopByte;
            packageHeaderBytes.set(stopByteArray, 1)            

            var counterBuffer = new ArrayBuffer(2);
            var counterView = new DataView(counterBuffer, 0);
            counterView.setInt16(0, packageCountDown);
            packageHeaderBytes.set(new Uint8Array(counterBuffer), 2)

            let packageBytes = new Uint8Array(this.BLE_PACKAGE_SIZE);
            packageBytes.set(packageHeaderBytes, 0);
            packageBytes.set(packagePayloadBytes, 4);

            // console.log(this.bufferToHex(packageBytes.buffer))
            outputPackages.push(packageBytes.buffer);

        }

        return outputPackages;

    }

    bufferToHex(buffer: ArrayBuffer) {
        return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
    }

    hexToBuffer(hex: string) {
        var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
            return parseInt(h, 16)
        }))
        return typedArray.buffer;
    }

}