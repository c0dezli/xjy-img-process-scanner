import fs from "fs";
import path from "path";

import db from "./datastore";
import apis from "./api";

const constractForm = async (file_path) => {
  const file_path_obj = path.parse(file_path);

    console.log(file_path_obj);
  const file = new File(
    [fs.readFileSync(file_path)],
    file_path_obj.name,
    { type: `image/jpg` } // what I upload is image.
  );

  const json_result = await db.findOne({
    compressed_file_name: file_path_obj.name,
  });
  const form_data = new FormData();

  form_data.append("file", file);
  form_data.append("json", JSON.stringify(json_result));
  return form_data;
};

export const uploadFile = async (file_path) => {
  console.log("Start to upload", file_path);
  const form_data = await constractForm(file_path);

  try {
    // scanner_id
    const scanner_id = (await db.findOne({ key: "scanner_id" })).value;

    // school_id
    const school_id = (await db.findOne({ key: "school_id" })).value;
      
    // Upload file
    await apis.scannerUpload(form_data, school_id, scanner_id);

    // Log
    console.log("Uploaded", file_path);

    // Update DB
    await db.update(
      { compressed_file_path: file_path },
      {
        $set: {
          uploaded: true,
          uploaded_time: Date.now(),
        },
      },
      { multi: false }
    );
  } catch (err) {
    console.log(err);
  }
};
