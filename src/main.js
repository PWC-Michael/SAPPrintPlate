// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'core-js/es6/promise'
import 'core-js/es6/string'
import 'core-js/es7/array'
// import cssVars from 'css-vars-ponyfill'
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'
import axios from 'axios'

import { appConfig } from './shared/app-config';

// todo
// cssVars()

Vue.use(BootstrapVue);

// set up the http base object
appConfig.setEnvironment('dev');

const httpbase = axios.create({
  baseURL: appConfig.getAPIBase()
})
Vue.prototype.$http = httpbase;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  }
})
