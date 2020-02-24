import { post } from "./http";

import db from "./datastore";

export default {
  // 用来向现有服务器上传图片的API
  async scannerUpload(form_data) {
    const custom_api = (await db.findOne({
      key: "custom_api"
    })).value;
    console.log(custom_api);
    if (!custom_api) {
      const res = await post(
        // "http://test.disc.xinjiaoyu.com/file-server/scannerUpload",
        "https://postman-echo.com/post",
        form_data,
        { "Content-Type": "multipart/form-data" }
      );
      return res;
    } else {
      const res = await post(
        custom_api.value,
        form_data,
        { "Content-Type": "multipart/form-data" }
      );
      return res;
    }
  },

  // 通知识别服务器扫描开始
  async updateUserInfo(school_id, scanner_id) {
    const res = await post(
      `/school/${school_id}/scanner/${scanner_id}/scan_start`
    );
    return res;
  }
};
