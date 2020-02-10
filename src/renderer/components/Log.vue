<template>
  <div class="view">
    <article>
      <h2 style="font-weight:500">扫描日志</h2>
      <x-card>
        <table>
          <th></th>
          <td></td>
        </table>
      </x-card>
    </article>
  </div>
</template>

<script>
export default {
  name: "log-page",
  data() {
    return {
      electron: process.versions.electron,
      name: this.$route.name,
      node: process.versions.node,
      path: this.$route.path,
      platform: require("os").platform(),
      vue: require("vue/package.json").version
    };
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
