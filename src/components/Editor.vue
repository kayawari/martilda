<template>
  <div class='editor'>
    <h1>Editor Page</h1>
    <span>{{user.displayName}}</span>
    <div>
      <button @click="logout">logout</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'editor',
  props: ['user'],
  data () {
    return {}
  },
  methods: {
    logout: function(){
      firebase.auth().signOut();
    }
  }
}
</script>

<style lang='scss'>
</style>
