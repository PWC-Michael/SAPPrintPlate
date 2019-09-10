<template>
    <div class="loader-container">
        <img src="/img/loading-spinner.gif" />
    </div>
</template>
<script>
  module.exports = {
   data: function () {
      return {
        name: 'LoadingSpinner'
      }
    }
  }
</script>
<style scoped>
 div.loader-container {
    width: 100%;
    height: 100%;
    text-align: center;
  }
</style>