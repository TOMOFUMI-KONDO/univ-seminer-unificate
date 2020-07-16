<template>
  <div class="sign-in">
    <div class="button-wrapper">
      <b-button block variant="info" @click="googleSignIn('tohoku')" class="sign-in d-flex justify-content-around align-items-center py-3">
        <img src="../assets/img/google.jpg" width="50" height="50" alt="googleのロゴ"/>
        <p class="mb-0">{{$t('signin1')}}<br class="d-sm-none" />{{$t('signin2')}}</p>
      </b-button>
    </div>
    <b-alert v-if="isError" dismissible variant="danger" class="mt-2">{{errorMessage}}</b-alert>
    <b-dd block variant="outline-secondary" :text="$t('whatisthetohokuuniversityaccount')" class="button-wrapper">
      <b-dd-text class="dd-item">
        {{$t('signin_description_1')}}<br/>
        <span class="d-block pt-3">{{$t('signin_description_2')}}</span>
        <span class="d-block pb-3">{{$t('signin_description_3')}}</span>
        {{$t('signin_description_4')}}
      </b-dd-text>
    </b-dd>
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
    width: 90%;
    max-width: 500px;
    margin: 100px auto 0 auto;

    .sign-in {
      font-size: 24px;
    }

    .dropdown-menu {
      width: 100%;
    }
  }
</style>