<template>
  <div>
    <div class="notification" v-for="notification in notifications" :key="notification.id">
      {{ notification.message }}
    </div>
  </div>
</template>

<script>
import useNotifications from '@/composibles/useNotifications'

export default {
  setup () {
    const { notifications } = useNotifications()

    return { notifications }
  }
}
</script>

<style scoped>

</style>
