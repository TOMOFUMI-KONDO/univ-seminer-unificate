import Vue from "vue";
import App from "./App.vue";
import firebase from "./firebase";
import router from "./router";
import store from "./store";

import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.use(BootstrapVue);
Vue.config.productionTip = false;

//データを保管しているgoogleカレンダーのID
//this.$calendarIdの形でグローバル変数として使える
Vue.prototype.$calendarId =
  "c_5ei73mce5d9am4lc4idap33s50@group.calendar.google.com";

firebase.init();

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
