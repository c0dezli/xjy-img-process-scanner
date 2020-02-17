<template>
  <div id="app">
    <main id="main">
      <side-bar />
      <div id="views">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script>
import scheduler from "./libs/scheduler";
import SideBar from "./components/Sidebar";

export default {
  name: "xjy-img-process-printer",
  components: { SideBar },

  async created() {
    await this.initSettings();
  },
  methods: {
    async initSettings() {
      // Create all the settings at once

      // scanner_id
      const scanner_id = await this.$db.findOne({ key: "scanner_id" });
      if (!scanner_id) {
        await this.$db.insert({ value: "", key: "scanner_id" });
      }

      // school_name
      const school_name = await this.$db.findOne({ key: "school_name" });
      if (!school_name) {
        await this.$db.insert({ value: "", key: "school_name" });
      }

      // folder_path
      let folder_path = await this.$db.findOne({ key: "folder_path" });
      if (!folder_path) {
        await this.$db.insert({ value: "", key: "folder_path" });
      } else {
        folder_path = folder_path.value;
        // if have folder_path, then start the scheduler
        scheduler(folder_path);
      }

      // scan_qr_code_local
      const scan_qr_code_local = await this.$db.findOne({
        key: "scan_qr_code_local"
      });
      if (!scan_qr_code_local) {
        await this.$db.insert({ value: true, key: "scan_qr_code_local" });
      }

      // keep_uncompressed
      const keep_uncompressed = await this.$db.findOne({
        key: "keep_uncompressed"
      });
      if (!keep_uncompressed) {
        await this.$db.insert({ value: true, key: "keep_uncompressed" });
      }

      // keep_log
      const keep_log = await this.$db.findOne({
        key: "keep_log"
      });
      if (!keep_log) {
        await this.$db.insert({ value: 4, key: "keep_log" });
      }
    }
    // async
  }
};
</script>

<style>
#app {
  min-width: 600px;
}

#main {
  position: relative;
  display: flex;
  flex-flow: row;
  width: 100%;
  height: 100vh;
}

/**
* Views
 */

#views {
  display: block;
  width: 100%;
  height: 100%;
  min-width: 20px;
  min-height: 20px;
  position: relative;
  flex: 1;
}

#views > .view {
  display: block;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
}

#views > .view > article {
  padding: 0 70px;
  margin: 0 auto;
  max-width: 780px;
  box-sizing: border-box;
}

#views section {
  margin-bottom: 35px;
}

#views section[hidden] + hr,
#views section[data-last-visible] + hr {
  display: none;
}

#views section h3,
#views section h4,
#views section h5 {
  position: relative;
}

h4 {
  margin-top: 0;
}
</style>
