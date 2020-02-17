const fs = require("fs");
const path = require("path");
const execFile = require("child_process").execFile;
const mozjpeg = require("mozjpeg");
// const makeDir = require("make-dir");

import db from "./datastore";
import { scanQRCode } from "./qrcode";
import { uploadFile } from "./upload";

/**
 * Generate new path to shrinked file
 * @param  {string} pathName Filepath
 * @return {object}         filepath object
 */
const generateNewPath = pathName => {
  let objPath = path.parse(pathName);
  // objPath.dir = objPath.dir + "/compressed";
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
 * Remove Uncompressed File
 * @param  {string} origin_file_path Filepath
 */
const removeUncompressed = async origin_file_path => {
  // 从数据库中查看是否保存未压缩文件
  const keep_uncompressed = (await db.findOne({ key: "keep_uncompressed" }))
    .value;

  if (keep_uncompressed) return;

  const file_name = path.parse(origin_file_path).name;

  fs.unlink(origin_file_path, () => {});

  console.log(`Removed uncompressed ${file_name}`);

  await db.update(
    { file_name: file_name },
    { $set: { removed_original: true } },
    { multi: false }
  );
};

/**
 * Main Logic
 * @param  {string} file_path Filepath
 */
export const compressFile = origin_file_path => {
  const origin_file_name = path.parse(origin_file_path).name;
  console.log(`Compressing ${origin_file_name}`);

  if (path.extname(origin_file_path).toLowerCase() !== ".jpg") return;

  /** Process image(s) */
  fs.readFile(origin_file_path, "utf8", (err, data) => {
    if (err) throw err;

    const compressed_file_path = generateNewPath(origin_file_path);

    execFile(
      mozjpeg,
      ["-outfile", compressed_file_path, origin_file_path],
      async err => {
        const compressed_file_path_obj = path.parse(compressed_file_path);
        // 压缩完成， 更新数据库，打印Log
        console.log(`Compressed ${compressed_file_path_obj.name}`);
        try {
          await db.update(
            {
              file_name: compressed_file_path_obj.name.replace(".min", "")
            },
            {
              $set: {
                compressed: true,
                compressed_file_name: compressed_file_path_obj.name,
                compressed_file_path: compressed_file_path,
                compressed_time: Date.now()
              }
            },
            { multi: false }
          );
        } catch (error) {
          console.log(
            `Failed to update DB for ${origin_file_name}, the error message`,
            error
          );
          // TODO: what should we do when update DB failed?
        }

        // 移除本地未压缩文件
        await removeUncompressed(origin_file_path);

        // 扫描二维码
        await scanQRCode(compressed_file_path);

        // 上传文件
        await uploadFile(compressed_file_path);
      }
    );
  });
};
