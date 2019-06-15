// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'highlight.js/styles/solarized-dark.css'

Vue.config.productionTip = false

firebase.initializeApp({
  apiKey: 'AIzaSyD2ub_LEV3BQHei-Up2ZdKICdK2kKByV4E',
  authDomain: 'martilda-37e87.firebaseapp.com',
  databaseURL: 'https://martilda-37e87.firebaseio.com',
  projectId: 'martilda-37e87',
  storageBucket: 'martilda-37e87.appspot.com',
  messagingSenderId: '536717214627'
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requireAuth)) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        next()
      } else {
        next({
          path: '/',
          query: {redirect: to.fullPath}
        })
      }
    })
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
