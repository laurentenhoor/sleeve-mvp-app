/* @license
 *
 * Block transfer protocol for BluetoothLE using JavaScript
 * Version: 1.0.3
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 ARM Ltd
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// https://github.com/umdjs/umd
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['bleat'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS
        module.exports = factory(require('bleat'));
    } else {
        // Browser globals with support for web workers (root is window)
        factory(root.bleat);
    }
}(this, function(bleat) {
    "use strict";

    var writePrefix = "00000001";
    var readPrefix = "00000002";
    var mtu = 20;
    var headerLength = 3;
    var payloadSize = mtu - headerLength;

    var PacketType = {
        NONE:           -1,
        WRITE_SETUP:    0,
        WRITE_REQUEST:  1,
        WRITE_PAYLOAD:  2,
        WRITE_LAST:     3,
        WRITE_DIRECT:   4,
        READ_SETUP:     5,
        READ_REQUEST:   6,
        READ_PAYLOAD:   7,
        READ_LAST:      8,
        READ_DIRECT:    9,
        NOTIFY:         10
    };

    var littleEndian = (function() {
        var buffer = new ArrayBuffer(2);
        new DataView(buffer).setInt16(0, 256, true);
        return new Int16Array(buffer)[0] === 256;
    })();

    function getCharacteristic(prefix) {
        var charUUID = prefix + this.uuid.substr(8);
        if (!this.characteristics[charUUID]) {
            bleat.raiseError("unable to find characteristic " + charUUID + ", is device connected?");
            return null;
        }
        return this.characteristics[charUUID];
    }

    function onNotify(data) {
        var writeChar = getCharacteristic.call(this, writePrefix);
        if (!writeChar) return;

        var view = new DataView(data);
        var type = (view.getUint8(0) >> 4);

        if (type === PacketType.WRITE_REQUEST) {
            var startIndex = view.getUint8(3);
            startIndex = (startIndex << 8) | view.getUint8(2);
            startIndex = (startIndex << 8) | view.getUint8(1);

            if (startIndex === 0xFFFFFF && typeof this.onFinish === "function") this.onFinish();
            else {
                var fragCount = view.getUint8(6);
                fragCount = (fragCount << 8) | view.getUint8(5);
                fragCount = (fragCount << 8) | view.getUint8(4);
                sendFragment(writeChar, this.arrayBuffer, startIndex, fragCount, this.onProgress);
            }
        } else if (type === PacketType.READ_PAYLOAD || type === PacketType.READ_LAST) {
            var index = view.getUint16(1, littleEndian);
            index = (index << 4) | (view.getUint8(0) & 0x0F);

            var offset = (index * payloadSize);
            var payload = new Uint8Array(data, headerLength);
            var bufferView = new Uint8Array(this.arrayBuffer);

            bufferView.set(payload, offset);
            this.fragCheck[index] = true;
            this.onProgress(index);

            if (type === PacketType.READ_LAST) {
                for (index = 0; index < this.fragCheck.length; index++) {
                    if (!this.fragCheck[index]) break;
                }
                if (index < this.fragCheck.length) {
                    // Failed transfer, resend
                    sendReadRequest(writeChar, index, 1);
                } else if (typeof this.onFinish === "function") this.onFinish();
            }
        } else if (type === PacketType.NOTIFY) {
            if (this.notifyFn) this.notifyFn(data.slice(1));
        }
    }

    function sendFragment(characteristic, arrayBuffer, index, fragCount, progressFn) {
        var offset = (index * payloadSize);
        var size = (offset + payloadSize > arrayBuffer.byteLength) ? arrayBuffer.byteLength - offset : payloadSize;
        var payload = arrayBuffer.slice(offset, offset + size);
        var packetType = (fragCount === 1) ? PacketType.WRITE_LAST : PacketType.WRITE_PAYLOAD;
        sendPacket(characteristic, packetType, index, payload, function() {
            if (progressFn) progressFn(index);
            if (fragCount > 1) sendFragment(characteristic, arrayBuffer, index + 1, fragCount - 1, progressFn);
        }.bind(this));
    }

    function sendPacket(characteristic, packetType, index, arrayBuffer, callbackFn) {
        var packet = new ArrayBuffer(headerLength + arrayBuffer.byteLength);
        var view = new DataView(packet);
        view.setUint8(0, (packetType << 4) | (index & 0x0F));
        view.setUint8(1, (index >> 4) & 0xFF);
        view.setUint8(2, (index >> 12) & 0xFF);

        view = new Uint8Array(packet);
        view.set(new Uint8Array(arrayBuffer), headerLength);

        characteristic.write(view, function() {
            if (callbackFn) callbackFn();
        }.bind(this));
    }

    function sendReadRequest(characteristic, index, length) {
        var packet = new ArrayBuffer(7);
        var view = new DataView(packet);
        view.setUint8(0, (PacketType.READ_REQUEST << 4));
        view.setUint8(1, index & 0xFF);
        view.setUint8(2, (index >> 8) & 0xFF);
        view.setUint8(3, (index >> 16) & 0xFF);
        view.setUint8(4, length & 0xFF);
        view.setUint8(5, (length >> 8) & 0xFF);
        view.setUint8(6, (length >> 16) & 0xFF);

        characteristic.write(view);
    }

    function createProgressFn(progressFn, packets) {
        return function(index) {
            if (typeof progressFn === "function") {
                var percent = Math.ceil((index + 1) * 100 / packets);
                progressFn(percent);
            }
        };
    }

    function ensureNotify(characteristic, notifyFn, completeFn) {
        if (characteristic.notify) {
            if (typeof completeFn === "function") completeFn();
            return;
        }
        characteristic.notify = true;
        characteristic.enableNotify(notifyFn, completeFn);
    }

    bleat.Service.prototype.enableNotify = function(notifyFn, completeFn) {
        var readChar = getCharacteristic.call(this, readPrefix);
        if (readChar) {
            this.notifyFn = notifyFn;
            ensureNotify(readChar, onNotify.bind(this), completeFn);
        }
    };

    bleat.Service.prototype.disableNotify = function() {
        this.notifyFn = null;
    };

    bleat.Service.prototype.blockWrite = function(arrayBuffer, offset, callbackFn, progressFn) {
        offset = offset || 0;

        var writeChar = getCharacteristic.call(this, writePrefix);
        if (!writeChar) return;

        this.onFinish = function() {
            this.arrayBuffer = null;
            if (callbackFn) callbackFn();
        };

        if (arrayBuffer.byteLength <= payloadSize) {
            // Direct Write
            sendPacket(writeChar, PacketType.WRITE_DIRECT, offset, arrayBuffer, function() {
                if (progressFn) progressFn(100);
                this.onFinish();
            }.bind(this));
        } else {
            // Fragmented Write
            this.arrayBuffer = arrayBuffer;

            var readChar = getCharacteristic.call(this, readPrefix);
            if (!readChar) return;

            ensureNotify(readChar, onNotify.bind(this), function() {

                // Write Setup
                var fragCount = Math.ceil(arrayBuffer.byteLength / payloadSize);
                var packet = new ArrayBuffer(10);
                var view = new DataView(packet);
                this.onProgress = createProgressFn(progressFn, fragCount);

                view.setUint8(0, (PacketType.WRITE_SETUP << 4));

                view.setUint8(1, arrayBuffer.byteLength & 0xFF);
                view.setUint8(2, (arrayBuffer.byteLength >> 8) & 0xFF);
                view.setUint8(3, (arrayBuffer.byteLength >> 16) & 0xFF);

                view.setUint8(4, offset & 0xFF);
                view.setUint8(5, (offset >> 8) & 0xFF);
                view.setUint8(6, (offset >> 16) & 0xFF);

                view.setUint8(7, fragCount & 0xFF);
                view.setUint8(8, (fragCount >> 8) & 0xFF);
                view.setUint8(9, (fragCount >> 16) & 0xFF);

                writeChar.write(view);
            }.bind(this));
        }
    };

    bleat.Service.prototype.blockRead = function(callbackFn, progressFn) {
        var readChar = getCharacteristic.call(this, readPrefix);
        if (!readChar) return;

        this.onFinish = function() {
            if (callbackFn && this.arrayBuffer) callbackFn(this.arrayBuffer.slice(0));
            this.arrayBuffer = null;
            this.fragCheck = null;
        };
        readChar.read(function(data) {
            var view = new DataView(data);
            var type = (view.getUint8(0) >> 4);

            if (type === PacketType.READ_DIRECT) {
                // Direct Read
                this.arrayBuffer = data.slice(1);
                if (progressFn) progressFn(100);
                this.onFinish();
            } else if (type === PacketType.READ_SETUP) {
                // Fragmented Read
                var writeChar = getCharacteristic.call(this, writePrefix);
                if (!writeChar) return;

                ensureNotify(readChar, onNotify.bind(this), function() {

                    var length = view.getUint8(3);
                    length = (length << 8) | view.getUint8(2);
                    length = (length << 8) | view.getUint8(1);

                    var fragCount = view.getUint8(6);
                    fragCount = (fragCount << 8) | view.getUint8(5);
                    fragCount = (fragCount << 8) | view.getUint8(4);

                    this.arrayBuffer = new ArrayBuffer(length);
                    this.fragCheck = new Array(fragCount);
                    this.onProgress = createProgressFn(progressFn, fragCount);

                    sendReadRequest(writeChar, 0, fragCount);
                }.bind(this));
            }
        }.bind(this));
    };
}));