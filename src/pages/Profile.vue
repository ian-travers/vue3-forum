<template>
  <div class="container">
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
import { mapGetters } from 'vuex'

export default {
  name: 'PageProfile',
  props: {
    edit: {
      type: Boolean,
      default: false
    }
  },
  components: { UserProfileCard, UserProfileCardEditor, PostList },
  computed: {
    ...mapGetters({ user: 'authUser' }),
    userPosts () {
      return this.$store.state.posts.filter(post => post.userId === this.user.id)
    }
  }
}
</script>
