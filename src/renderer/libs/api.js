import { get, patch, post } from "http";

const API_ROOT = "0.0.0.0";

export default {
  // 用来向现有服务器上传图片的API
  async scannerUpload(data) {
    const res = await post(
      "http://test.disc.xinjiaoyu.com/file-server/scannerUpload",
      data
    );
    return res;
  },
  // 上传图片
  async scanUpload(school_id, data) {
    const res = await post(`${API_ROOT}/school/${school_id}/scan_upload`, data);
    return res;
  },
  // 上传JSON Result
  async jsonResultUpload(school_id, data) {
    const res = await post(
      `${API_ROOT}/school/${school_id}>/json_result_upload`,
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
