<template>
  <div class="flash-message" @click="$emit('closeFlash')">
    <slot/>
  </div>
</template>

<style lang="scss">
  .flash-message {
    width: 100%;
    background: crimson;
    text-align: center;
    padding: 10px;
    color: white;
    font-weight: bold;
    border-bottom: #2c3e50 2px;
    border-top: #2c3e50 2px;
  }
</style>
