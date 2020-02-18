import { get, patch, post } from "./http";

const API_ROOT = "0.0.0.0";

export default {
  // 用来向现有服务器上传图片的API
  async scannerUpload(form_data) {
    const res = await post(
      "http://test.disc.xinjiaoyu.com/file-server/scannerUpload",
      // "https://postman-echo.com/post",
      form_data
    );
    return res;
  },
  // // 上传图片
  // async scannerUpload(scanner_id, form_data) {
  //   const res = await post(
  //     `${API_ROOT}/scanner/${scanner_id}/upload`,
  //     form_data,
  //     { "Content-Type": "multipart/form-data" }
  //   );
  //   return res;
  // },
  // 上传JSON Result
  async jsonResultUpload(school_id, data) {
    const res = await post(
      `${API_ROOT}/scanner/${scanner_id}>/json_result_upload`,
      data
    );
    return res;
  },
  // 通知识别服务器扫描开始
  async updateUserInfo(school_id, scanner_id) {
    const res = await post(
      `${API_ROOT}/school/${school_id}/scanner/${scanner_id}/scan_start`
    );
    return res;
  }
};
