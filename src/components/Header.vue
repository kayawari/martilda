<template>
  <div id="header">
    <h1>Editor Page</h1>
    <div v-if='islogin'>
      <span>{{user.displayName}}</span>
      <button v-on:click="logout">logout</button>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'header',
  props: ['user', 'islogin'],
  methods: {
    logout: function () {
      firebase.auth().signOut()
    }
  }
}
</script>
