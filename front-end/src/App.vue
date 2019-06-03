<template>
  <v-app id="app">
    <v-toolbar 
      class="header-toolbar"
    >
    <v-toolbar-title>Minter Lottery</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn flat href="https://tele.click/minterw" target="_blank">Telegram</v-btn>
    </v-toolbar-items>
  </v-toolbar>
  <div class="app-container">
    <router-view />
  </div>
  </v-app>
</template>

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
  background: #b4583f !important;

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
    color: #b4583f !important;
}

.app-container {
  display: flex;
  flex-flow: column wrap;
  margin: 20px;
}
</style>
