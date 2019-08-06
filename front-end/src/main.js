import Vue from "vue";
import App from "./App.vue";
import Vuetify from "vuetify";
//import router from "./router";

import VueQrcode from "@chenfengyuan/vue-qrcode";

import "vuetify/dist/vuetify.min.css"; // Ensure you are using css-loader

Vue.use(Vuetify);
Vue.component(VueQrcode.name, VueQrcode);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
