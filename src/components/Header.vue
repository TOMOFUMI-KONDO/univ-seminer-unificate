<template>
  <header class="mb-5 pt-4 pb-lg-4 pb-2">
    <b-navbar toggleable="lg" type="dark" class="justify-content-around">
      <h1 class="mb-0">東北大学セミナー情報</h1>
      <b-navbar-toggle target="nav-collapse" class="border-0"/>
      <b-collapse id="nav-collapse" class="flex-grow-0" is-nav>
        <router-link to="/">イベントカレンダー</router-link>
        <router-link to="/in-session">開催中のイベント</router-link>
        <auth/>
      </b-collapse>
    </b-navbar>
  </header>
</template>

<script>
  import Auth from './Auth'

  export default {
    name: 'Header',
    components: {Auth}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  header {
    background-color: #220c4c;
    color: #fafafa;

    h1 {
      @media (max-width: 991px) {
        padding-bottom: 10px;
      }

      @media (max-width: 576px) {
        font-size: 26px;
      }
    }

    .navbar-toggler {
      @media (max-width: 991px) {
        padding-top: 0;
        padding-bottom: 10px;

        &:focus {
          outline: none;
          -webkit-tap-highlight-color: rgba(0,0,0,0);
        }
      }

      .navbar-toggler-icon {
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'%3e%3cpath stroke='rgb%28255, 255, 255%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e") !important;
      }
    }


    #nav-collapse {
      @media (max-width: 991px) {
        display: flex;
        flex-wrap: wrap;
        padding: 20px 15% 0 15%;
        border-top: #aaa solid 1px;
      }

      @media (max-width: 900px) {
        padding: 20px 14% 0 14%;
      }

      @media (max-width: 800px) {
        padding: 20px 11% 0 11%;
      }

      @media (max-width: 700px) {
        padding: 20px 10% 0 10%;
      }

      @media (max-width: 600px) {
        padding: 20px 8% 0 8%;
      }

      @media (max-width: 500px) {
        padding: 20px 11% 0 11%;
      }

      @media (max-width: 400px) {
        padding: 20px 7% 0 7%;
      }

      > * {
        @media (max-width: 991px) {
          flex: 0 0 100%;
          text-align: right;
          line-height: 2.0em;
          font-size: 20px;
        }
      }

      a {
        font-weight: bold;
        color: #fafafa;

        @media (min-width: 992px) {
          margin-right: 40px;
        }

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
