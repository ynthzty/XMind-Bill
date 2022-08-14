<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

body {
  padding: 0;
  margin: 0;
  background-color: #D7CEC7;
}

.header-title{
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 50px;
    color: #fff;
}

.bill-main{
  padding: 0 3rem 3rem !important;
}
</style>
