const fs = require("fs");
const path = require("path");
const execFile = require("child_process").execFile;
const mozjpeg = require("mozjpeg");
// const makeDir = require("make-dir");

import db from "./datastore";
import { scanQrCode } from "./qrcode";

/**
 * Generate new path to shrinked file
 * @param  {string} pathName Filepath
 * @return {object}         filepath object
 */
const generateNewPath = pathName => {
  let objPath = path.parse(pathName);
  // objPath.dir = objPath.dir + "/minified";
  // makeDir.sync(objPath.dir);

  /** Suffix setting */
  const suffix = ".min";
  objPath.base = objPath.name + suffix + objPath.ext;

  return path.format(objPath);
};

/**
 * Calculate filesize
 * @param  {string} file_path Filepath
 * @param  {boolean} mb     If true return as MB
 * @return {number}         filesize in MB or KB
 */
const getFileSize = file_path => {
  const stats = fs.statSync(file_path);

  return stats.size;
};

/**
 * Main Logic
 * @param  {string} file_path Filepath
 */
export const compressFile = file_path => {
  console.log(`Compressing ${file_path}`);
  if (path.extname(file_path).toLowerCase() !== ".jpg") return;

  /** Process image(s) */
  fs.readFile(file_path, "utf8", (err, data) => {
    if (err) throw err;

    const minified_file = generateNewPath(file_path);
    const origin_file = file_path;

    execFile(mozjpeg, ["-outfile", minified_file, origin_file], async err => {
      const minified_file_path_obj = path.parse(minified_file);

      console.log(`Compressed ${minified_file_path_obj.name}`);
      // Start Scan QR Code
      try {
        console.log(`Scanning QR Code in ${minified_file_path_obj.name}`);
        const qr_code_result = await scanQrCode(minified_file);
        console.log(`Find QR Code in ${minified_file_path_obj.name}`);

        await db.update(
          { compressed_file_name: minified_file_path_obj.name },
          {
            $set: {
              qr_code: qr_code_result,
              qr_code_scanned: true,
              page: "A"
            }
          },
          { multi: false }
        );
      } catch (error) {
        await db.update(
          { compressed_file_name: minified_file_path_obj.name },
          {
            $set: {
              qr_code: null,
              qr_code_scanned: true,
              page: "B"
            }
          },
          { multi: false }
        );
        console.log(`Failed to find QRCode in ${minified_file_path_obj.name}`);
      }
    });
  });
};
