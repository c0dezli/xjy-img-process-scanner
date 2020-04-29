<template>
  <div id="sidebar">
    <header id="header">
      <h1 id="logo">新教育平台<br />扫描仪配置</h1>
    </header>

    <hr />
    <nav id="nav">
      <section>
        <router-link :to="{ name: 'data-page' }" tabindex="-1">
          <x-button skin="nav" role="button" aria-disabled="false" tabindex="0">
            <x-icon name="info"></x-icon>
            <x-label>扫描信息</x-label>
          </x-button>
        </router-link>

        <router-link :to="{ name: 'log-page' }" tabindex="-1">
          <x-button skin="nav" role="button" aria-disabled="false" tabindex="0">
            <x-icon name="book"></x-icon>
            <x-label>扫描日志</x-label>
          </x-button>
        </router-link>

        <router-link :to="{ name: 'settings-page' }" tabindex="-1">
          <x-button skin="nav" role="button" aria-disabled="false" tabindex="0">
            <x-icon name="settings"></x-icon>
            <x-label>设置</x-label>
          </x-button>
        </router-link>

        <br />
        <p>版本： 1.2.0</p>
        <p>更新日期：2020/04/29</p>
        <p>Electron版本：{{ electron }}</p>
        <p>Node版本：{{ node }}</p>
        <p>Vue版本：{{ vue }}</p>
        <p>运行平台：{{ platform }}</p>
        
        <x-button @click="checkApp">检查更新</x-button>
        <p style="color:red"  v-html="update_text"></p>

      </section>
    </nav>
  </div>
</template>

<script>
import apis from "../libs/api";

export default {
  name: "side-bar",
  data() {
    return {
      version_num: '1.2.0',
      electron: process.versions.electron,
      name: this.$route.name,
      node: process.versions.node,
      path: this.$route.path,
      platform: require("os").platform(),
      vue: require("vue/package.json").version,
      update_text: ''
    };
  },
  methods: {
    async checkApp() {
        const res = await apis.checkApp();
        if (res.data.version_num !== this.version_num)
            this.update_text = `有新版本${res.data.version_num} <br> 请前往${res.data.download_address}下载`;
        else 
            this.update_text = `已是最新版本`;

    },
  },
  async created(){
        const res = await apis.checkApp();
        if (res.data.version_num !== this.version_num)
            this.update_text = `有新版本${res.data.version_num} <br> 请前往${res.data.download_address}下载`;
  }
};
</script>

<style scoped>
#sidebar {
  position: relative;
  min-width: 270px;
  height: 100vh;
  box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
  z-index: 100;
  background: white;
}

#sidebar #header {
  padding: 20px 0;
}

#sidebar #header + hr {
  margin-top: -1px;
}

#sidebar h1 {
  margin: 0px 0px 0px 50px;
  line-height: 1;
}

#sidebar #nav {
  margin-bottom: 20px;
  width: 100%;
  padding: 0 30px;
}

#sidebar #nav .external-link-icon {
  margin: 0;
  width: 20px;
  height: 20px;
}

#sidebar #nav x-button {
  width: calc(100%);
  margin-left: -30px;
  padding: 8px 30px;
  --ripple-background: white;
}

#sidebar #nav x-button x-label {
  font-size: 15px;
}
</style>
