<template>
  <div id="header-nav">
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand href="#">Martilda</b-navbar-brand>
      <b-collapse is-nav id="nav_collapse">
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-button size="sm" class="my-2 my-sm-0" v-if='$route.path == "/editor"' @click="logout">Logout</b-button>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  name: 'header-nav',
  data () {
    return {
      path: '/',
      fixed: 'top'
    }
  },
  methods: {
    logout: function () {
      firebase.auth().signOut()
    }
  }
}
</script>
