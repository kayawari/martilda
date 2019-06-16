<template>
  <div id='home'>
    <img src="/static/leon.png">
    <ul class="menu">
      <router-link to="/signin" tag="li">Singin</router-link>
      <router-link to="/editor" tag="li">Editor</router-link>
    </ul>
  </div>
</template>
<style lang='scss' scoped>
  .menu {
    padding: 0;
    text-align: center;
    list-style: none;
    border-bottom: 1px solid gray;
    li {
      padding: 10px 0;
      border-top: 1px solid gray;
      cursor: pointer;
    }
  }
</style>
