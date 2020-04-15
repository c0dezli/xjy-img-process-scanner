import db from "./datastore";

export const generateSchema = async (file_name, file_path) => {
  // scanner_id
  const scanner_id = (
    await db.findOne({
      key: "scanner_id"
    })
  ).value;

  // school_id
  const school_id = (
    await db.findOne({
      key: "school_id"
    })
  ).value;

  return {
    type: "file_record",
    create_time: Date.now(),
    file_name: file_name,
    file_path: file_path,
    removed_original: false,

    compressed: false,
    compressed_file_path: null,
    compressed_file_name: null,
    compressed_time: null,

    qr_code_scanned: false,
    qr_code_scanned_time: null,
    qr_code: "",
    page: "",

    uploaded: false,
    uploaded_time: null,

    scanner_id: scanner_id,
    school_id: school_id
  };
};
