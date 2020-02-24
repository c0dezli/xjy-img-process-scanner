import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "data-page",
      component: require("@/components/Data").default
    },
    {
      path: "/log",
      name: "log-page",
      component: require("@/components/Log").default
    },
    {
      path: "/log-detail",
      name: "log-detail-page",
      component: require("@/components/LogDetail").default
    },
    {
      path: "/settings",
      name: "settings-page",
      component: require("@/components/Settings").default
    },
    {
      path: "*",
      redirect: "/"
    }
  ]
});
