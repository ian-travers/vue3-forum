<template>
  <img :src="src || '/user-placeholder.png'">
</template>

<script>
export default {
  name: 'AppAvatarImage',
  props: {
    src: { type: String }
  }
}
</script>

<style scoped>
  img {
    object-fit: cover;
  }
</style>
