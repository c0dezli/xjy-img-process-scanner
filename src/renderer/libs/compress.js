const fs = require("fs");
const path = require("path");
const execFile = require("child_process").execFile;
const mozjpeg = require("mozjpeg");
const makeDir = require("make-dir");

/**
 * Generate new path to shrinked file
 * @param  {string} pathName Filepath
 * @return {object}         filepath object
 */
const generateNewPath = pathName => {
  let objPath = path.parse(pathName);
  objPath.dir = objPath.dir + "/minified";
  makeDir.sync(objPath.dir);

  /** Suffix setting */
  const suffix = ".min";
  objPath.base = objPath.name + suffix + objPath.ext;
  console.log(objPath);
  return path.format(objPath);
};

/**
 * Calculate filesize
 * @param  {string} filePath Filepath
 * @param  {boolean} mb     If true return as MB
 * @return {number}         filesize in MB or KB
 */
const getFileSize = filePath => {
  const stats = fs.statSync(filePath);

  return stats.size;
};

/**
 * Main Logic
 * @param  {string} filePath Filepath
 */
export const compressFile = filePath => {
  console.log(path.extname(filePath).toLowerCase());
  if (path.extname(filePath).toLowerCase() !== ".jpg") return;

  /** Get filesize */
  let sizeOrig = getFileSize(filePath);

  /** Process image(s) */
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      throw err;
    }

    const newFile = generateNewPath(filePath);
    const origFile = filePath;

    execFile(mozjpeg, ["-outfile", newFile, origFile], err => {
      const sizeShrinked = getFileSize(newFile, false);
      console.log(err, newFile, sizeOrig, sizeShrinked);
    });
  });
};
