import path from "path";
import chokidar from "chokidar";

import db from "./datastore";
import { compressFile } from "./compress";
import { generateSchema } from "./json_schema";

export default watch_path => {
  const watcher = chokidar.watch(watch_path, {
    ignored: /[\/\\]\./,
    persistent: true
  });

  // Something to use when events are received.
  const log = console.log.bind(console);

  function onWatcherReady() {
    console.info("INIT SCAN COMPLETED");
  }

  // Declare the listeners of the watcher
  watcher
    .on("add", async function(file_path) {
      if (path.extname(file_path).toLowerCase() !== ".jpg") return;

      const file_name = path.parse(file_path).name;

      const minified_file = file_name.includes(".min");
      const exist_in_db = await db.findOne({
        $or: [{ file_name: file_name }, { compressed_file_name: file_name }]
      });

      if (!exist_in_db) {
        console.log("File", file_name, "has been added");
      }

      // Orgin File Added
      if (!exist_in_db && !minified_file) {
        const new_file_record = await generateSchema(file_name, file_path);
        await db.insert(new_file_record);
        // 开始压缩文件
        compressFile(file_path);
      }
    })
    // .on("addDir", function(path) {
    //   console.log("Directory", path, "has been added");
    //   //   onAddDir();
    // })
    // .on("change", function(path) {
    //   console.log("File", path, "has been changed");
    // })
    // .on("unlink", function(path) {
    //   console.log("File", path, "has been removed");
    //   //   onRemove();
    // })
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
