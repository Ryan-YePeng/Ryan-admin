<template>
  <elFrame :src="src"></elFrame>
</template>

<script>
  import elFrame from '../../../components/iframe/index'

  export default {
    name: "index",
    components: {elFrame},
    data() {
      return {
        data: null,
        src: 'http://ylhy.online/druid/index.html'
      }
    }
  }
</script>

<style scoped>

</style>
