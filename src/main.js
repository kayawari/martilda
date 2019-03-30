// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false

firebase.initializeApp({
  apiKey: 'AIzaSyD2ub_LEV3BQHei-Up2ZdKICdK2kKByV4E',
  authDomain: 'martilda-37e87.firebaseapp.com',
  databaseURL: 'https://martilda-37e87.firebaseio.com',
  projectId: 'martilda-37e87',
  storageBucket: 'martilda-37e87.appspot.com',
  messagingSenderId: '536717214627'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
