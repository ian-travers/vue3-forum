<template>
  <div class="notifications">
    <div class="notification" v-for="notification in notifications" :key="notification.id">
      <span>{{ notification.message }}</span>
      <button @click="removeNotification(notification.id)">x</button>
    </div>
  </div>
</template>

<script>
import useNotifications from '@/composibles/useNotifications'

export default {
  setup () {
    const { notifications, removeNotification } = useNotifications()

    return { notifications, removeNotification }
  }
}
</script>

<style scoped>
.notifications {
  position: fixed;
  right: 0;
  bottom: 20px;
}

.notification {
  background: white;
  display: flex;
  justify-content: space-between;
  width: 350px;
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);
  padding: 10px 20px;
  margin-bottom: 5px;
  border-left: 6px solid #57ad8d;
}
</style>
