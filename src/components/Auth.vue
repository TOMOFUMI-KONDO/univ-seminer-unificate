<template>
  <div
    v-if="isSignIn"
    class="wrapper d-flex flex-column justify-content-between"
  >
    <p @click="signOut" class="sign-out d-inline-block mb-0">
      サインアウト
    </p>
    <p class="email">({{ userEmail }})</p>
  </div>
</template>

<script>
import firebase from "../firebase";

export default {
  name: "Auth",
  computed: {
    isSignIn() {
      return this.$store.getters.userStatus;
    },
    userEmail() {
      if (this.isSignIn) {
        return this.$store.getters.userStatus.email;
      } else {
        return "";
      }
    },
  },
  methods: {
    signOut() {
      firebase.logout();
    },
  },
};
</script>

<style scoped lang="scss">
.wrapper {
  @media (min-width: 1250px) {
    margin-left: 100px;
  }

  margin-top: 30px;

  .sign-out {
    cursor: pointer;
    font-weight: bold;

    &:hover {
      color: darken(#fafafa, 10%);
      text-decoration: underline;
    }
  }

  .email {
    font-size: 12px;
  }
}
</style>
