<template>
  <div id="app">
    <header>
      <main-header></main-header>
      <main>
        <router-view />
      </main>
    </header>
    <footer>
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

  data: () => ({}),
};
</script>
<style scoped>
@import url("https://fonts.googleapis.com/earlyaccess/hanna.css");

footer {
  margin-top: 5%;
  background-color: whitesmoke;
}
</style>
