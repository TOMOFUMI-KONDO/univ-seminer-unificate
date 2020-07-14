<template>
  <div class="sign-in">
    <div class="button-wrapper">
      <b-button
        block
        variant="info"
        @click="googleSignIn"
        class="sign-in d-flex justify-content-around align-items-center py-3"
      >
        <img
          src="../assets/img/google.jpg"
          width="50"
          height="50"
          alt="googleのロゴ"
        />
        <p class="mb-0">東北大アカウントで<br class="d-sm-none" />サインイン</p>
      </b-button>
    </div>
    <b-alert v-if="isError" dismissible variant="danger" class="mt-2">{{
      errorMessage
    }}</b-alert>
    <b-dd
      block
      variant="outline-secondary"
      text="東北大アカウントとは？"
      class="button-wrapper"
    >
      <b-dd-text class="dd-item">
        東北大アカウントは、<br />
        <span class="d-block pt-3">@tohoku.ac.jp(教職員用)</span>
        <span class="d-block pb-3">@dc.tohoku.ac.jp(学生用)</span>
        などのドメインを持つGoogleアカウントです。
      </b-dd-text>
    </b-dd>
  </div>
</template>

<script>
import firebase from "../firebase";

export default {
  name: "SignIn",
  data() {
    return {
      errorMessage: "",
      isError: false,
    };
  },
  methods: {
    googleSignIn() {
      firebase.login();
    },
  },
};
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
