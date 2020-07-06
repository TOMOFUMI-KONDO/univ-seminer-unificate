<template>
  <div id="app">
    <Header />
    <router-view class="main"/>
    <Loading class="loading" />
    <Footer />
  </div>
</template>

<script>
  import Header from "./components/Header"
  import Footer from "./components/Footer"
  import Loading from "./components/Loading"
  export default {
    components: {Header, Footer, Loading},
  }
</script>

<style lang="scss">
  html, body {
    height: 100%;
  }

  #app {
    height: 100%;
    text-align: center;
    color: #2c3e50;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    .main, .loading {
      min-height: 80%;
    }
  }

  .tooltip-inner {
    @media (min-width: 1181px) {
      max-width: 300px !important;
    }
  }
</style>
