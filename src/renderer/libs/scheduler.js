import chokidar from "chokidar";
import db from "./datastore";
import { compressFile } from "./compress";
import { scanQrCode } from "./qrcode";
const path = require("path");

export default (wathPath, onAdd, onAddDir, onRemove, onRemoveDir, onError) => {
  const watcher = chokidar.watch(wathPath, {
    ignored: /[\/\\]\./,
    persistent: true
  });

  // Something to use when events are received.
  const log = console.log.bind(console);

  function onWatcherReady() {
    console.info(
      "From here can you check for real changes, the initial scan has been completed."
    );
  }

  // Declare the listeners of the watcher
  watcher
    .on("add", async function(file_path) {
      console.log("File", file_path, "has been added");

      const file_path_obj = path.parse(file_path);
      const minified_file = file_path_obj.name.includes(".min");
      const exist_in_db = await db.findOne({
        $or: [
          { file_name: file_path_obj.name },
          { compressed_file_name: file_path_obj.name }
        ]
      });
      // Orgin File Added
      if (!exist_in_db && !minified_file) {
        const new_file_record = {
          type: "file_record",
          file_name: file_path_obj.name,
          file_path: file_path,
          compressed: false,
          compressed_file_path: "",
          compressed_file_name: "",
          qr_code_scanned: false,
          qr_code: "",
          page: "",
          uploaded: false,
          createTime: Date.now()
        };
        await db.insert(new_file_record);
        compressFile(file_path);
      }
      // Minify File Added
      else if (!exist_in_db && minified_file) {
        try {
          await db.update(
            { file_name: file_path_obj.name.replace(".min", "") },
            {
              $set: {
                compressed: true,
                compressed_file_name: file_path_obj.name,
                compressed_file_path: file_path
              }
            },
            { multi: false }
          );
        } catch (error) {
          console.log(
            `Failed to update DB for ${file_path_obj.name}, the error message`,
            error
          );
          // TODO: what should we do when update DB failed?
        }
      }
    })
    // .on("addDir", function(path) {
    //   console.log("Directory", path, "has been added");
    //   //   onAddDir();
    // })
    // .on("change", function(path) {
    //   console.log("File", path, "has been changed");
    // })
    .on("unlink", function(path) {
      console.log("File", path, "has been removed");
      //   onRemove();
    })
    // .on("unlinkDir", function(path) {
    //   console.log("Directory", path, "has been removed");
    //   //   onRemoveDir();
    // })
    .on("error", function(error) {
      console.log("Error happened", error);
      //   onError();
    })
    .on("ready", onWatcherReady);
  // .on("raw", function(event, path, details) {
  //   // This event should be triggered everytime something happens.
  //   console.log("Raw event info:", event, path, details);
  // });
};
