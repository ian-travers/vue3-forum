<template>
  <div class="profile-card">
    <VeeForm @submit="save">
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

      <AppFormField v-model="activeUser.username" name="username" label="Username" :rules="`required|unique:users,username,${user.username}`"/>
      <AppFormField v-model="activeUser.name" name="name" label="Name" rules="required"/>
      <AppFormField v-model="activeUser.bio" name="bio" label="Bio" as="textarea" rows="4" placeholder="Write a few words about yourself."/>

      <div class="stats">
        <span>{{ user.postsCount }} posts</span>
        <span>{{ user.threadsCount }} threads</span>
      </div>

      <hr>

      <AppFormField v-model="activeUser.website" name="website" label="Website" rules="url"/>
      <AppFormField v-model="activeUser.email" name="email" label="Email" :rules="`required|unique:users,email,${user.email}`" type="email"/>
      <AppFormField v-model="activeUser.location" name="location" label="Location" list="locations" @mouseenter="loadLocationOptions"/>
      <datalist id="locations">
        <option v-for="location in locationOptions" :value="location.name.common" :key="location.name.common"/>
      </datalist>

      <div class="btn-group space-between">
        <button class="btn-ghost" @click.prevent="cancel">Cancel</button>
        <button class="btn-blue" type="submit">Save</button>
      </div>
    </VeeForm>
    <UserProfileCardEditorReauthenticate
      v-model="needsReAuth"
      @success="onReauthenticated"
      @fail="onReauthenticatedFailed"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import UserProfileCardEditorRandomAvatar from '@/components/UserProfileCardEditorRandomAvatar'
import UserProfileCardEditorReauthenticate from '@/components/UserProfileCardEditorReauthenticate'

export default {
  name: 'UserProfileCardEditor',
  components: { UserProfileCardEditorRandomAvatar, UserProfileCardEditorReauthenticate },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      uploadingImage: false,
      activeUser: { ...this.user }, // cloning
      locationOptions: []
    }
  },
  methods: {
    ...mapActions('auth', ['uploadAvatar']),

    async loadLocationOptions () {
      if (this.locationOptions.length) return

      const res = await fetch('https://restcountries.com/v3.1/all')
      this.locationOptions = await res.json()
    },

    async handleAvatarUpload (e) {
      this.uploadingImage = true
      const file = e.target.files[0]
      const uploadedImage = await this.uploadAvatar({ file })
      this.activeUser.avatar = uploadedImage || this.activeUser.avatar
      this.uploadingImage = false
    },
    async handleRandomAvatarUpload () {
      const randomAvatarGenerated = this.activeUser.avatar.startsWith('https://pixabay')

      if (randomAvatarGenerated) {
        const image = await fetch(this.activeUser.avatar)
        const blob = await image.blob()

        this.activeUser.avatar = await this.uploadAvatar({ file: blob, filename: 'random' })
      }
    },
    async save () {
      await this.handleRandomAvatarUpload()
      await this.$store.dispatch('users/updateUser', { ...this.activeUser, threads: this.activeUser.threadsIds })
      await this.$store.dispatch('auth/updateEmail', { email: this.activeUser.email })
      this.$router.push({ name: 'Profile' })
    },
    cancel () {
      this.$router.push({ name: 'Profile' })
    }
  }
}
</script>
