<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #f0f0f0;
}

body {
  background: #111;
  padding: 0;
  margin: 0;
}

a {
  color: #b4b4b4;
  text-decoration: none;
  border-bottom: 1px dotted #b4b4b4;

  &:hover, &:focus, &:active {
    color: #919191;
    border: none;
  }
}
</style>
