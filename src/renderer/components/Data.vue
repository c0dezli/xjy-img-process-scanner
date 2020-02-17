<template>
  <div class="view">
    <article>
      <h2 style="font-weight:500">扫描信息</h2>
      <h4 style="font-weight:500;margin-top:0">
        {{ Date().toString() }}
      </h4>
      <x-card>
        <div class="items">
          <h4 style="font-weight:500">当前扫描任务</h4>
          <div class="item">
            <div class="value">{{ curr_log }}</div>
          </div>
          <br />

          <h4 style="font-weight:500">扫描统计</h4>
          <div class="item">
            <div class="name">本机今日扫描数量:</div>
            <div class="value">{{ scans_today }}</div>
          </div>
          <div class="item">
            <div class="name">本机共计扫描数量:</div>
            <div class="value">{{ scans_total }}</div>
          </div>
          <div class="item">
            <div class="name">扫描文件所在文件夹:</div>
            <div class="value">{{ folder_path }}</div>
          </div>
          <br />
          <h4 style="font-weight:500">本机信息</h4>
          <div class="item">
            <div class="name">本机ID:</div>
            <div class="value">{{ scanner_id }}</div>
          </div>
          <div class="item">
            <div class="name">本机所属学校:</div>
            <div class="value">{{ school_name }}</div>
          </div>
        </div>
      </x-card>
    </article>
  </div>
</template>

<script>
import { remote } from "electron";
import fs from "fs";

import { compressFile } from "../libs/compress";
import { scanQrCode } from "../libs/qrcode";

export default {
  name: "data-page",
  beforeMount() {
    this.initValues();
  },
  data() {
    return {
      scans_today: "",
      scans_total: "",
      folder_path: "",
      scanner_id: "",
      school_name: "",
      curr_log: "无"
    };
  },
  methods: {
    async initValues() {
      this.scanner_id = (await this.$db.findOne({ key: "scanner_id" })).value;
      this.school_name = (await this.$db.findOne({ key: "school_name" })).value;
      this.folder_path = (await this.$db.findOne({ key: "folder_path" })).value;
      this.scans_today = (
        await this.$db.find({
          type: "file_record",
          create_time: { $gte: Date.now() - 86400000 }
        })
      ).length;
      this.scans_total = (await this.$db.find({ type: "file_record" })).length;
    }
  }
};
</script>

<style scoped>
x-card {
  padding: 15px;
}

.title {
  color: #888;
  font-size: 18px;
  font-weight: initial;
  letter-spacing: 0.25px;
  margin-top: 10px;
}

.items {
  margin-top: 8px;
}

.item {
  display: flex;
  margin-bottom: 6px;
}

.item .name {
  color: #6a6a6a;
  margin-right: 6px;
}

.item .value {
  color: #35495e;
  font-weight: bold;
}
</style>
