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
import SideBar from "./components/Sidebar";

export default {
  name: "xjy-img-process-printer",
  components: { SideBar }
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
