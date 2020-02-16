const fs = require("fs");
const jpeg = require("jpeg-js");

import QrCode from "qrcode-reader";
import Jimp from "jimp";

import db from "./datastore";

// const Jimp = require("jimp");

export const scanQrCode = async file_path => {
  const jpeg_data = fs.readFileSync(file_path);
  const raw_image_data = jpeg.decode(jpeg_data, true); // return as Uint8Array

  const img = await Jimp.read({
    data: raw_image_data.data,
    width: raw_image_data.width,
    height: raw_image_data.height
  });

  const qr = new QrCode();

  // qrcode-reader's API doesn't support promises, so wrap it
  const value = await new Promise((resolve, reject) => {
    qr.callback = (err, v) => (err != null ? reject(err) : resolve(v));
    qr.decode(img.bitmap);
  });

  return value;
};
