<template>
  <footer class="mt-5 py-3 bg-dark text-light text-center">
    <p class="m-0">&copy; {{date}} WBA Future Leaders All Rights Reserved</p>
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
  }
</script>