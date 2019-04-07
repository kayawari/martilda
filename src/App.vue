<template>
  <div id='app'>
    <HeaderNav v-bind:user="userData" v-bind:islogin="isLogin"></HeaderNav>
    <Home v-if='!isLogin && !loading'></Home>
    <Editor v-if='isLogin' v-bind:user="userData"></Editor>
    <p v-if="loading">loading...</p>
  </div>
</template>

<script>
import Home from './components/Home.vue'
import Editor from './components/Editor.vue'
import HeaderNav from './components/HeaderNav.vue'
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Martilda',
      isLogin: false,
      userData: null,
      loading: true
    }
  },
  components: {
    'Home': Home,
    'Editor': Editor,
    'HeaderNav': HeaderNav
  },
  created: function () {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.isLogin = true
        this.userData = user
      } else {
        this.isLogin = false
        this.userData = null
      }
      this.loading = false
    })
  }
}
</script>

<style lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>
