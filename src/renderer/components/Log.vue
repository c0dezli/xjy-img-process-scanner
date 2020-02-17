<template>
  <div class="view">
    <article>
      <h2 style="font-weight:500">扫描日志</h2>
      <x-button @click="loadLogs">显示日志</x-button>
      <div v-for="(log, index) in logs" :key="index">
        <x-card>
          {{ JSON.stringify(log) }}
        </x-card>
      </div>
    </article>
  </div>
</template>

<script>
export default {
  name: "log-page",
  data() {
    return {
      logs: []
    };
  },
  methods: {
    async loadLogs() {
      const timestamp_list = this.getDatestampList();

      for (let i in timestamp_list) {
        const log = await this.$db.find({
          type: "file_record",
          create_time: {
            $gte: timestamp_list[parseInt(i) + 1]
          },
          create_time: { $lte: timestamp_list[parseInt(i)] }
        });

        this.logs.push(log);
      }
      console.log(this.logs);
    },

    getDatestampList() {
      const d = new Date();
      const today = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      let time_stamp = Date.parse(today) + 86400000;
      const result = [time_stamp];
      for (let i in [0, 1, 2, 3, 4]) {
        time_stamp -= 86400000;
        result.push(time_stamp);
      }
      return result;
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
