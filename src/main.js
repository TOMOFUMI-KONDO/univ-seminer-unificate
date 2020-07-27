import Vue from 'vue'
import App from './App.vue'
import firebase from './firebase'
import router from './router'
import store from './store'

import VueI18n from 'vue-i18n'
Vue.use(VueI18n);
const messages = {
  'ja': require('./locales/ja.json'),
  'en': require('./locales/en.json'),
};
const i18n = new VueI18n({
  locale: 'ja',
  fallbackLocale: 'ja', 
	messages,
});

import FlagIcon from "vue-flag-icon"
Vue.use(FlagIcon);

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.config.productionTip = false

firebase.init()

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')