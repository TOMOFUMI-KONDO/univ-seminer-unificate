<template>
  <header class="d-lg-flex align-items-center justify-content-around mb-5 py-4">
    <h1>東北大学セミナー情報まとめ</h1>
    <nav id="nav">
      <router-link to="/" class="mr-5">イベントカレンダー</router-link>
      <router-link to="/in-session">開催中のイベント</router-link>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'Header',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  header {
    background-color: #220c4c;
    color: #fafafa;

    h1 {
      @media (max-width: 991px) {
        margin-bottom: 20px;
      }

      @media (max-width: 576px) {
        font-size: 26px;
      }
    }

    nav {
      a {
        font-weight: bold;
        color: #fafafa;

        &.router-link-exact-active {
          color: rgb(198, 182, 15);

          &:hover {
            text-decoration: none;
            cursor: default;
          }
        }

        &:not(.router-link-exact-active) {
          &:hover {
            color: darken(#fafafa, 10%);
          }
        }
      }
    }
  }
</style>
