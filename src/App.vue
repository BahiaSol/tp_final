<template>
<div id="app">
  <NavBar v-if="!isLogin"></NavBar>
  <router-view></router-view>
</div>
</template>

<script>
import NavBar from './components/NavBar.vue'

export default {
  components: {
    NavBar
  },
  computed: {
    isLogin(){
      return this.$route.path === "/";
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

.nav {
  padding: 30px;
}

.nav a {
  font-weight: bold;
  color: #2c3e50;
}

.nav a.router-link-exact-active {
  color: #42b983;
}
</style>
