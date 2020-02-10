<template>
  <div class="view">
    <article>
      <h2 style="font-weight:500">扫描信息</h2>
      <h4 style="font-weight:500;margin-top:0">
        {{ Date().toString() }}
      </h4>
      <x-button @click="compressImg">测试压缩文件</x-button>
      <x-button @click="qrcode">测试QR Code</x-button>
      <x-card>
        <div class="items">
          <h4 style="font-weight:500">当前扫描任务</h4>
          <div class="item">
            <div class="name">上传中:</div>
            <div class="value">{{ name }}</div>
          </div>
          <div class="item">
            <div class="name">上传文件名:</div>
            <div class="value">{{ name }}</div>
          </div>
          <div class="item">
            <div class="name">上传进度:</div>
            <div class="value">{{ name }}</div>
          </div>
          <br />

          <h4 style="font-weight:500">扫描统计</h4>
          <div class="item">
            <div class="name">今日扫描数量:</div>
            <div class="value">{{ path }}</div>
          </div>
          <div class="item">
            <div class="name">本机共计扫描数量:</div>
            <div class="value">{{ path }}</div>
          </div>
          <div class="item">
            <div class="name">扫描文件所在文件夹:</div>
            <div class="value">{{ folder_path }}</div>
          </div>
          <br />
          <h4 style="font-weight:500">本机信息</h4>
          <div class="item">
            <div class="name">本机ID:</div>
            <div class="value">{{ folder_path }}</div>
          </div>
          <div class="item">
            <div class="name">本机所属学校:</div>
            <div class="value">{{ vue }}</div>
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
  async beforeMount() {
    this.folder_path = await this.$db.findOne({ key: "folder_path" });

    if (!this.folder_path) {
      await this.$db.insert({ value: "", key: "folder_path" });
    } else {
      this.folder_path = this.folder_path.value;
    }
  },
  data() {
    return {
      electron: process.versions.electron,
      name: this.$route.name,
      node: process.versions.node,
      path: remote.app.getPath("userData"),
      platform: require("os").platform(),
      vue: require("vue/package.json").version,
      folder_path: "undefined"
    };
  },
  methods: {
    async compressImg() {
      fs.readdir(this.folder_path, (err, dir) => {
        for (let file_name of dir) {
          console.log(file_name);
          compressFile(`${this.folder_path}/${file_name}`);
        }
      });
    },
    async qrcode() {
      fs.readdir(this.folder_path + "/minified", (err, dir) => {
        for (let file_name of dir) {
          if (file_name.split(".")[file_name.split(".").length - 1] === "jpg") {
            console.log(file_name);

            scanQrCode(`${this.folder_path}/minified/${file_name}`).then(
              code => {
                console.log(code);
              }
            );
          }
        }
      });
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
