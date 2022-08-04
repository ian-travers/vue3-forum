<template>
  <div class="notifications">
    <transition-group name="notification">
      <div
        class="notification"
        :class="`notification-type-${notification.type}`"
        v-for="notification in notifications"
        :key="notification.id"
      >
        <span>{{ notification.message }}</span>
        <button @click="removeNotification(notification.id)">x</button>
      </div>
    </transition-group>
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
  border-left: 15px solid #263959;
}

.notification.notification-type-error {
  border-left: 15px solid rgb(146, 5,5);
}

.notification-enter-active,
.notification-leave-active {
  transition: all .5s ease;
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.8s ease;
}
</style>
