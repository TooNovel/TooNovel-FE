<template>
  <div id="app">
    <header>
      <main-header></main-header>
    </header>
    <main>
      <router-view />
    </main>
    <footer v-if="!hideHeaderFooter">
      <main-footer></main-footer>
    </footer>
  </div>
</template>

<script>
import MainHeader from "./components/layout/MainHeader.vue";
import MainFooter from "./components/layout/MainFooter.vue";

export default {
  name: "App",

  components: {
    "main-header": MainHeader,
    "main-footer": MainFooter,
  },

  data: () => ({
    //showFooter: true,
  }),
  computed: {
    hideHeaderFooter() {
      return this.$route.meta.hideHeaderFooter === true;
    },
  },
};
</script>
<style>
@import url("https://fonts.googleapis.com/earlyaccess/hanna.css");
footer {
  margin-top: 5%;
  background-color: rgb(212, 212, 212);
}
#app {
  background-color: whitesmoke;
}
</style>
