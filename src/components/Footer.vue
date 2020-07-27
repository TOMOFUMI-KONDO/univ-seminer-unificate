<template>
  <footer class="mt-5 py-3 bg-dark text-light text-center">
    <p class="m-0">&copy; {{date}} WBA Future Leaders All Rights Reserved</p>
    <div>
      <button v-on:click="setLanguage('jp')" class="locale-button">
        <flag iso="jp" />
      </button>
      <button v-on:click="setLanguage('en')" class="locale-button">
        <flag iso="us" />
      </button>
    </div>
  </footer>
</template>

<script>
  import moment from 'moment'

  export default {
    data() {
      return {
        date: moment().format('YYYY')
      }
    },
    methods: {
      setLanguage: function(language) {
        this.$i18n.locale = language;
      }
    },
  }
</script>

<style>
.locale-button {
  background-color: transparent;
  border-style: none;
  color: inherit;
}

</style>