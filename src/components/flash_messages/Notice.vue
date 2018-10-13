<template>
  <div class="notice-message" v-on:click="$emit('closeNotice')">
    <slot/>
  </div>
</template>

<style lang="scss">
  .notice-message {
    width: 100%;
    background: forestgreen;
    text-align: center;
    padding: 10px;
    color: white;
    font-weight: bold;
    border-bottom: #2c3e50 2px;
    border-top: #2c3e50 2px;
  }
</style>
