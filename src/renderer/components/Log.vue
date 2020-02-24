<template>
  <div class="view">
    <article>
      <h2 style="font-weight:500">扫描日志</h2>
      <div v-for="(log, index) in logs" :key="index">
        <x-card>
          <router-link :to="{name:'log-detail-page', query:{log:log}}" v-html="log.msg"></router-link>
        </x-card>
      </div>
    </article>
  </div>
</template>

<script>
export default {
  name: "log-detail-page",
  data() {
    return {
      logs: []
    };
  },
  created() {
    this.loadLogs();
  },
  methods: {
    async loadLogs() {
      const timestamp_list = this.getDatestampList();

      for (let i in timestamp_list) {
        if (i < timestamp_list.length-1) {
          const log = await this.$db.find({
            type: "file_record",
            create_time: {
              $gte: timestamp_list[parseInt(i) + 1]
            },
            create_time: { $lte: timestamp_list[parseInt(i)] }
          });
         
          const curr_date = new Date(timestamp_list[parseInt(i) + 1]);
          const msg =  `${curr_date.getFullYear()}-${curr_date.getMonth() +
              1}-${curr_date.getDate()}日志        共<b>${log.length}</b>份扫描   <b>查看详情</b>`
          this.logs.push({msg, time_gte: timestamp_list[parseInt(i) + 1], time_lte:timestamp_list[parseInt(i)]})

        }
      }
    },

    getDatestampList() {
      const d = new Date();
      const today = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      let time_stamp = Date.parse(today) + 86400000;
      const result = [time_stamp];
      for (let i in [0, 1, 2, 3, 4, 5, 6]) {
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
