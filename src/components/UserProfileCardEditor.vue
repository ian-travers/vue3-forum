<template>
  <div class="profile-card">
    <form @submit.prevent="save">
      <p class="text-center avatar-edit">
        <label for="avatar">
          <AppAvatarImage
            class="avatar-xlarge img-update"
            :src="activeUser.avatar"
            :alt="`${user.name} profile picture`"
          />
          <span class="avatar-upload-overlay">
            <AppSpinner v-if="uploadingImage" color="white"/>
            <fa-icon v-else icon="camera" size="3x" :style="{color: 'white', opacity: '80%'}"/>
          </span>
          <input v-show="false" type="file" id="avatar" accept="image/*" @change="handleAvatarUpload">
        </label>
      </p>
      <UserProfileCardEditorRandomAvatar @hit="activeUser.avatar = $event"/>

      <div class="form-group">
        <input
          v-model="activeUser.username"
          type="text"
          placeholder="Username"
          class="form-input text-lead text-bold"
        >
      </div>

      <div class="form-group">
        <input
          v-model="activeUser.name"
          type="text"
          placeholder="Full Name"
          class="form-input text-lead text-bold"
        >
      </div>

      <div class="form-group">
        <label for="user_bio">Bio</label>
        <textarea
          v-model="activeUser.bio"
          class="form-input"
          id="user_bio"
          placeholder="Write a few words about yourself"
        ></textarea>
      </div>

      <div class="stats">
        <span>{{ user.postsCount }} posts</span>
        <span>{{ user.threadsCount }} threads</span>
      </div>

      <hr>

      <div class="form-group">
        <label for="user_website" class="form-label">Website</label>
        <input
          v-model="activeUser.website"
          autocomplete="off"
          class="form-input"
          id="user_website"
        >
      </div>

      <div class="form-group">
        <label for="user_email" class="form-label">Email</label>
        <input
          v-model="activeUser.email"
          autocomplete="off"
          class="form-input"
          id="user_email"
        >
      </div>

      <div class="form-group">
        <label for="user_location" class="form-label">Location</label>
        <input
          v-model="activeUser.location"
          autocomplete="off"
          class="form-input"
          id="user_location"
        >
      </div>

      <div class="btn-group space-between">
        <button class="btn-ghost" @click.prevent="cancel">Cancel</button>
        <button class="btn-blue" type="submit">Save</button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import UserProfileCardEditorRandomAvatar from '@/components/UserProfileCardEditorRandomAvatar'

export default {
  name: 'UserProfileCardEditor',
  components: { UserProfileCardEditorRandomAvatar },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      uploadingImage: false,
      activeUser: { ...this.user } // cloning
    }
  },
  methods: {
    ...mapActions('auth', ['uploadAvatar']),
    async handleAvatarUpload (e) {
      this.uploadingImage = true
      const file = e.target.files[0]
      const uploadedImage = await this.uploadAvatar({ file })
      this.activeUser.avatar = uploadedImage || this.activeUser.avatar
      this.uploadingImage = false
    },
    save () {
      this.$store.dispatch('users/updateUser', { ...this.activeUser })
      this.$router.push({ name: 'Profile' })
    },
    cancel () {
      this.$router.push({ name: 'Profile' })
    }
  }
}
</script>
