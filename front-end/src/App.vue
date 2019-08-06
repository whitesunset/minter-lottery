<template>
  <v-app id="app" :dark="goDark">
    <v-toolbar 
      class="header-toolbar"
    >
    <v-toolbar-title>Minter Lottery</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
      <!-- <v-btn flat href="https://minter.work" target="_blank">Сайт</v-btn> -->
      <v-btn flat href="https://tele.click/minter_lottery" target="_blank">Telegram</v-btn>
      <!-- <v-switch style="margin-top: 15px"
        v-model="goDark"
      ></v-switch> -->
    </v-toolbar-items>
  </v-toolbar>
  <div class="app-container">
    <Home class="app-content" />
  </div>
  </v-app>
</template>

<script>
import Home from './views/Home';

export default {
  name: 'App',
  components: { Home },
  data() {
    return {
      goDark: false
    }
  },
}
</script>


<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #ffffff;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #fff !important;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.header-toolbar {
  background: rgb(230, 72, 28) !important;

  a {
    color: #fff !important;
  }
}

.v-toolbar__title {
  color:#fff !important;

  &:hover {
    cursor: pointer;
  }
}

a {
    color: #FC4F1E !important;
}

.app-container {
  display: flex;
  flex-flow: column wrap;
  margin: 20px;
}

.v-input {
  label {
    font-family: 'Avenir', Helvetica, Arial, sans-serif !important;
    -webkit-font-smoothing: antialiased !important;
    color: #fff !important;
  }
}

@media screen and (min-width: 1280px) {
  .app-container {
    display: grid;
    grid-template-columns: auto 1280px auto;
  }

  .app-content {
    grid-column: 2 / 3;
  }
}
</style>
