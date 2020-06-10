<template>
  <div class="sign-in">
    <div class="button-wrapper">
      <p>tohoku.ac.jpのアカウントをお持ちの方</p>
      <b-button block variant="primary" @click="googleSignIn('tohoku')" class="button">サインイン</b-button>
    </div>
    <div class="button-wrapper w-50 mx-auto">
      <p>or</p>
      <div class="d-flex justify-content-center">
        <b-button block variant="secondary" @click="googleSignIn('ecei')" class="button">ecei.ac.jpでサインイン</b-button>
        <b-button block variant="secondary" @click="googleSignIn('riec')" class="button">riec.ac.jpでサインイン</b-button>
      </div>
    </div>
    <b-alert v-if="isError" dismissible variant="danger">{{errorMessage}}</b-alert>
  </div>
</template>

<script>
  import firebase from '../firebase'

  export default {
    name: 'SignIn',
    data() {
      return {
        errorMessage: '',
        isError: false
      }
    },
    methods: {
      googleSignIn(domain) {
        firebase.login(domain)
      },
    },
  }
</script>

<style lang="scss">
  .button-wrapper {
    &:first-of-type {
      margin-bottom: 100px;

      p, button {
        font-size: 24px;
      }
    }

    &:not(:first-of-type) {
      p {
        font-size: 20px;
      }
    }

    .button {
      width: 80%;
      max-width: 250px;
      margin: 0 auto;
      padding: 10px 0;
    }
  }
</style>