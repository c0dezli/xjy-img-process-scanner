<template>
  <div class="view">
    <article>
      <h2 style="font-weight:500">扫描日志详情</h2>
      <h4 v-html="$route.query.log.msg"></h4>
      <x-card>
          {{JSON.stringify(log, null, 4)}} 
      </x-card>
    </article>
  </div>
</template>

<script>
export default {
  name: "log-detail-page",
  data() {
    return {
      log: ""
    };
  },
  created() {
    this.loadLogs();
  },
  methods: {
    async loadLogs() {
      this.log = await this.$db.find({
        type: "file_record",
        create_time: {
          $gte: this.$route.query.log.time_gte
        },
        create_time: { $lte: this.$route.query.log.time_lte }
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
