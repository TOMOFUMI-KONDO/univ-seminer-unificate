<template>
  <p v-if="isSignIn" @click="signOut" class="sign-out d-inline-block mb-0">
    {{$t('signout')}}
  </p>
</template>

<script>
import firebase from "../firebase";

export default {
  name: "Auth",
  computed: {
    isSignIn() {
      return this.$store.getters.isSignIn;
    },
  },
  methods: {
    signOut() {
      firebase.logout();
    },
  },
  created: () => {
    firebase.onAuth();
  },
};
</script>

<style scoped lang="scss">
.sign-out {
  cursor: pointer;
  font-weight: bold;

  @media (min-width: 1171px) {
    margin-left: 100px;
  }

  @media (max-width: 991px) {
    margin-top: 20px;
  }

  &:hover {
    color: darken(#fafafa, 10%);
    text-decoration: underline;
  }
}
</style>
