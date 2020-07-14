<template>
  <div class="manage-sign-in">
    <div class="button-wrapper">
      <b-button
        block
        variant="danger"
        @click="signIn"
        class="sign-in d-flex justify-content-around align-items-center py-3"
      >
        <img
          src="../assets/img/google.jpg"
          width="50"
          height="50"
          alt="googleのロゴ"
        />
        <p class="mb-0 text-light">
          登録済みのイベントを<br class="d-sm-none" />管理する
        </p>
      </b-button>
    </div>
    <b-alert v-if="isError" dismissible variant="danger" class="mt-2">{{
      errorMessage
    }}</b-alert>
  </div>
</template>

<script>
import firebase from "../firebase";

export default {
  name: "Management",
  data() {
    return {
      errorMessage: "",
      isError: false,
    };
  },
  methods: {
    signIn() {
      const input = prompt("パスワードを入力してください。");
      firebase.manageLogin(input);
    },
  },
};
</script>

<style lang="scss" scoped>
.button-wrapper {
  width: 90%;
  max-width: 500px;
  margin: 100px auto 0 auto;

  .sign-in {
    font-size: 24px;
  }
}
</style>
