<template>
  <div id="signin">
    <h1>Welcome to MyMarkdown</h1>
    <button @click="googleLogin">googleアカウントでログイン</button>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  name: 'signin',
  methods: {
    googleLogin: function () {
      firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider())
    }
  }
}
</script>
