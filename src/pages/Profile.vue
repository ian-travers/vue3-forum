<template>
  <div class="container" style="width: 100%">
    <div class="flex-grid">
      <div class="col-3 push-top">
        <UserProfileCardEditor v-if="edit" :user="user"/>
        <UserProfileCard v-else :user="user"/>
      </div>

      <div class="col-7 push-top">
        <div class="profile-header">
          <span class="text-lead"><b>{{ user.username }}</b> recent activity</span>
          <a href="#">See only started threads?</a>
        </div>
        <hr />
        <PostList :posts="user.posts" />
      </div>
    </div>
  </div>
</template>

<script>
import PostList from '@/components/PostList'
import UserProfileCard from '@/components/UserProfileCard'
import UserProfileCardEditor from '@/components/UserProfileCardEditor'
import asyncDataStatus from '@/mixins/asyncDataStatus'
import { mapGetters } from 'vuex'

export default {
  name: 'PageProfile',
  props: {
    edit: {
      type: Boolean,
      default: false
    }
  },
  mixins: [asyncDataStatus],
  components: { UserProfileCard, UserProfileCardEditor, PostList },
  computed: {
    ...mapGetters('auth', { user: 'authUser' }),
    lastPostFetched () {
      if (this.user.posts.length === 0) return null
      return this.user.posts[this.user.posts.length - 1]
    }
  },
  async created () {
    await this.$store.dispatch('auth/fetchAuthUsersPosts', { startAfter: this.lastPostFetched })

    this.asyncDataStatus_fetched()
  }
}
</script>
