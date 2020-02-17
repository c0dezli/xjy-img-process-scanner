const fs = require("fs");
const jpeg = require("jpeg-js");
const path = require("path");

import QrCode from "qrcode-reader";
import Jimp from "jimp";

import db from "./datastore";

const scan = async file_path => {
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

export const scanQRCode = async compressed_file_path => {
  const compressed_file_name = path.parse(compressed_file_path).name;
  // 从数据库中查看是否在本地扫描二维码
  const scan_qr_code_local = (await db.findOne({ key: "scan_qr_code_local" }))
    .value;

  if (!scan_qr_code_local) return;

  // Start Scan QR Code
  try {
    console.log(`Scanning QR Code in ${compressed_file_name}`);
    const qr_code_result = await scan(compressed_file_path);
    console.log(`Found QR Code in ${compressed_file_name}!!!`);

    await db.update(
      { compressed_file_name: compressed_file_name },
      {
        $set: {
          qr_code: qr_code_result,
          qr_code_scanned: true,
          qr_code_scanned_time: Date.now(),
          page: "A"
        }
      },
      { multi: false }
    );
  } catch (error) {
    await db.update(
      { compressed_file_name: compressed_file_name },
      {
        $set: {
          qr_code: null,
          qr_code_scanned: true,
          qr_code_scanned_time: Date.now(),
          page: "B"
        }
      },
      { multi: false }
    );
    console.log(`Unable to find QRCode in ${compressed_file_name}`);
  }
};
