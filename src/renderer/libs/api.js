import { post, get } from "./http";

import db from "./datastore";

export default {
  // 用来向现有服务器上传图片的API
  async scannerUpload(form_data, school_id, scanner_id) {
    const custom_api = (
      await db.findOne({
        key: "custom_api",
      })
    ).value;

    const API_ROOT = custom_api ? "http://127.0.0.1:8000" : custom_api;

    const res = await post(
      API_ROOT + `/schools/${school_id}/scanners/${scanner_id}/upload`,
      form_data,
      { "Content-Type": "multipart/form-data" }
    );
    return res;
  },

  // 更新扫描仪与学校对应关系
  async updateScannerInfo(school_id, scanner_id) {
    const custom_api = (
      await db.findOne({
        key: "custom_api",
      })
    ).value;

    const API_ROOT = custom_api ? "http://127.0.0.1:8000" : custom_api;

    const res = await post(
      API_ROOT + `/schools/${school_id}/scanners/${scanner_id}/update`
    );
    return res;
  },

  // 查看App更新情况
  async checkApp() {
    const custom_api = (
      await db.findOne({
        key: "custom_api",
      })
    ).value;

    const API_ROOT = custom_api ? "http://127.0.0.1:8000" : custom_api;

    const res = await get(`${API_ROOT}/check_app`);
    return res;
  },
};
