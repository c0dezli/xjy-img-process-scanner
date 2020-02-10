const fs = require("fs");
const jpeg = require("jpeg-js");

import QrCode from "qrcode-reader";
import Jimp from "jimp";

// const Jimp = require("jimp");

export const scanQrCode = async imgPath => {
  const jpegData = fs.readFileSync(imgPath);
  const rawImageData = jpeg.decode(jpegData, true); // return as Uint8Array

  const img = await Jimp.read({
    data: rawImageData.data,
    width: rawImageData.width,
    height: rawImageData.height
  });

  var qr = new QrCode();

  // qrcode-reader's API doesn't support promises, so wrap it
  const value = new Promise((resolve, reject) => {
    qr.callback = (err, v) => (err != null ? reject(err) : resolve(v));
    qr.decode(img.bitmap);
  });
  return value;
};
