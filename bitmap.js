/*
Copyright (c) 2014, Kyohei SHIMADA
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
* Redistributions of source code must retain the above copyright notice, 
  this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, 
  this list of conditions and the following disclaimer in the documentation 
  and/or other materials provided with the distribution.
* Neither the name of the <organization> nor the　names of its contributors 
  may be used to endorse or promote products derived from this software 
  without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

// ignore Windows Bitmap Header.

var Bitmap = function (binary){
    this.row = binary;
    this.binary = new DataView(binary);
    this.bfSize    = this.binary.getUint32(0x0002, true);
    this.bfOffBits = this.binary.getUint32(0x000A, true);
    this.bcWidth   = this.binary.getUint32(0x0012, true);
    this.bcHeight  = this.binary.getUint32(0x0016, true);
    //console.log(this.binary.getUint8(0));
};

// should be 16973, because 'BM' of binary. 
Bitmap.prototype.getBfType = function() {
    return this.binary.getUint16(0x0000);
};

Bitmap.prototype.getBfSize = function() {
    return this.bfsize;
};

Bitmap.prototype.getBfOffBits = function() {
    return this.bfOffBits;
};

Bitmap.prototype.getBcSize = function() {
    return this._getUint32(0x000E);
};

Bitmap.prototype.getBcWidth = function() {
    return this.bcWidth;
};

Bitmap.prototype.getBcHeight = function() {
    return this.bcHeight;
};

Bitmap.prototype.getBcPlanes = function() {
    return this.binary.getUint16(0x001A, true);
};

Bitmap.prototype.getBcBitCount= function() {
    return this.binary.getUint16(0x001C, true);
};

Bitmap.prototype.toGray = function() {
    var grayImgSize = this.bfSize;
    var grayImg = new Uint8Array(grayImgSize);
    var copy = new Uint8Array(this.row, 0, this.bfOffBits);
    grayImg.set(copy);

    /*grayImg[2] = (grayImgSize >>> 0 ) & 0x00000000;
    grayImg[3] = (grayImgSize >>> 8 ) & 0x000000FF;
    grayImg[4] = (grayImgSize >>> 16) & 0x000000FF;
    grayImg[5] = (grayImgSize >>> 24);
    */

    var RED_PARAM = 306;
    var GREEN_PARAM = 600;
    var BLUE_PARAM = 117;

    for (var i = 0; i < this.bcWidth * this.bcHeight; i++) {
        var blue  = this.binary.getUint8(this.bfOffBits + i * 4);
        var green = this.binary.getUint8(this.bfOffBits + i * 4 + 1);
        var red   = this.binary.getUint8(this.bfOffBits + i * 4 + 2);

        var gray = ((red * RED_PARAM + green * GREEN_PARAM + blue * BLUE_PARAM) >>> 10);
        grayImg[this.bfOffBits + i * 4] = gray;
        grayImg[this.bfOffBits + i * 4 + 1] = gray;
        grayImg[this.bfOffBits + i * 4 + 2] = gray;
    }
    var base64String = 'data:image/bmp;base64,' + this._arrayBufferToBase64(grayImg);

    return base64String;
};

Bitmap.prototype._arrayBufferToBase64 = function( buffer ) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }:
    return window.btoa(binary);
};
