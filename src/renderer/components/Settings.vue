<template>
  <div class="view">
    <article>
      <h2 style="font-weight:500">设置</h2>
      <x-card>
        <div class="items">
          <h4 style="font-weight:500">本机设置</h4>
          <div class="item">
            <div class="name">本机ID:</div>
            <div v-show="!scanner_id_change" class="value">
              {{ scanner_id }}
            </div>
            <input v-show="scanner_id_change" v-model="scanner_id" />
            <x-button
              @click="changeScannerID"
              skin="condensed"
              class="change-button"
            >
              <x-label v-if="!scanner_id_change">修改</x-label>
              <x-label v-else>确定</x-label>
            </x-button>
            <x-button
              v-if="scanner_id_change"
              skin="condensed"
              class="change-button"
            >
              <x-label @click="scanner_id_change = false">取消</x-label>
            </x-button>
          </div>
          <div class="item">
            <div class="name">本机所属学校:</div>
            <div v-show="!school_name_change" class="value">
              {{ school_name }}
            </div>
            <input v-show="school_name_change" v-model="school_name" />
            <x-button
              @click="changeSchoolName"
              skin="condensed"
              class="change-button"
            >
              <x-label v-if="!school_name_change">修改</x-label>
              <x-label v-else>确定</x-label>
            </x-button>
            <x-button
              v-if="school_name_change"
              skin="condensed"
              class="change-button"
            >
              <x-label @click="school_name_change = false">取消</x-label>
            </x-button>
          </div>
          <br />
          <h4 style="font-weight:500">扫描设置</h4>
          <div class="item">
            <div class="name">扫描文件所在文件夹:</div>
            <div class="value">
              {{ folder_path }}
            </div>

            <x-button
              @click="changeFolderPath"
              skin="condensed"
              class="change-button"
            >
              <x-label>修改</x-label>
            </x-button>
          </div>
          <div class="item">
            <div class="name">是否在本地识别二维码:</div>
            <div class="value">
              {{ scan_qr_code_local ? "是" : "否" }}
            </div>

            <x-button
              @click="changeScanQrCodeLocal"
              skin="condensed"
              class="change-button"
            >
              <x-label>修改</x-label>
            </x-button>
          </div>
          <div class="item">
            <div class="name">保留未压缩扫描件:</div>
            <div class="value">
              {{ keep_uncompressed ? "是" : "否" }}
            </div>

            <x-button
              @click="changeKeepUncompressed"
              skin="condensed"
              class="change-button"
            >
              <x-label>修改</x-label>
            </x-button>
          </div>
          <div class="item">
            <div class="name">日志保留时间:</div>
            <div v-show="!keep_log_change" class="value">{{ keep_log }}</div>
            <input
              v-show="keep_log_change"
              v-model="keep_log"
              style="width:50px"
            />
            周
            <x-button
              @click="changeKeepLog"
              skin="condensed"
              class="change-button"
            >
              <x-label v-if="!keep_log_change">修改</x-label>
              <x-label v-else>确定</x-label>
            </x-button>
            <x-button
              v-if="keep_log_change"
              skin="condensed"
              class="change-button"
            >
              <x-label @click="keep_log_change = false">取消</x-label>
            </x-button>
          </div>
          <h4 style="font-weight:500">Dev</h4>

          <x-button @click="clearLog">清空日志</x-button>
        </div>
      </x-card>
    </article>
  </div>
</template>

<script>
import { remote } from "electron";

export default {
  name: "log-page",
  data() {
    return {
      scanner_id: "",
      scanner_id_change: false,
      school_name: "",
      school_name_change: false,
      scan_qr_code_local: "",
      folder_path: "",
      keep_uncompressed: true,
      keep_log: 4,
      keep_log_change: false
    };
  },
  async beforeMount() {
    await this.refreshValue();
  },
  methods: {
    async changeScannerID() {
      if (this.scanner_id_change) {
        await this.$db.update(
          { key: "scanner_id" },
          { value: this.scanner_id, key: "scanner_id" }
        );
        await this.refreshValue();
        this.scanner_id_change = false;
      } else {
        this.scanner_id_change = true;
      }
    },
    async changeSchoolName() {
      if (this.school_name_change) {
        await this.$db.update(
          { key: "school_name" },
          { value: this.school_name, key: "school_name" }
        );
        await this.refreshValue();
        this.school_name_change = false;
      } else {
        this.school_name_change = true;
      }
    },
    async changeFolderPath() {
      const dialog = remote.require("electron").dialog;

      const path = dialog.showOpenDialog({
        properties: ["openDirectory"]
      });
      if (path) {
        await this.$db.update(
          { key: "folder_path" },
          { value: path[0], key: "folder_path" }
        );
        await this.refreshValue();
      }
    },

    async changeScanQrCodeLocal() {
      await this.$db.update(
        { key: "scan_qr_code_local" },
        { value: !this.scan_qr_code_local, key: "scan_qr_code_local" }
      );
      await this.refreshValue();
    },
    async changeKeepUncompressed() {
      await this.$db.update(
        { key: "keep_uncompressed" },
        { value: !this.keep_uncompressed, key: "keep_uncompressed" }
      );
      await this.refreshValue();
    },
    async changeKeepLog() {
      if (this.keep_log_change) {
        await this.$db.update(
          { key: "keep_log" },
          { value: this.keep_log, key: "keep_log" }
        );
        await this.refreshValue();
        this.keep_log_change = false;
      } else {
        this.keep_log_change = true;
      }
    },

    async refreshValue() {
      this.scanner_id = (await this.$db.findOne({ key: "scanner_id" })).value;
      this.school_name = (await this.$db.findOne({ key: "school_name" })).value;
      this.folder_path = (await this.$db.findOne({ key: "folder_path" })).value;
      this.keep_log = (await this.$db.findOne({ key: "keep_log" })).value;
      this.scan_qr_code_local = (
        await this.$db.findOne({ key: "scan_qr_code_local" })
      ).value;
      this.keep_uncompressed = (
        await this.$db.findOne({ key: "keep_uncompressed" })
      ).value;
    },
    async clearLog() {
      const DB = await this.$db.find({ type: "file_record" });
      console.log(DB);
      this.$db.remove({ type: "file_record" }, { multi: true });
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

.change-button {
  margin-left: 15px;
}
</style>
