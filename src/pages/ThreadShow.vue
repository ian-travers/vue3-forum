<template>
  <div v-if="asyncDataStatus_ready" class="col-large push-top">
    <h1>
      {{ thread.title }}
      <router-link
        :to="{ name: 'ThreadEdit', id: this.id }"
        v-if="thread.userId === authUser?.id"
      >
        <button class="btn-green btn-small">Edit Thread</button>
      </router-link>
    </h1>

    <p>
      By, <a href="#" class="link-unstyled">{{ thread.author?.name }}</a>, <AppDate :timestamp="thread.publishedAt"/>.
      <span v-show="!!thread.repliesCount" style="float: right; margin-top: 2px" class="hide-mobile text-faded text-small">
        {{ thread.repliesCount }} replies by {{ thread.contributorsCount }} contributors
      </span>
    </p>

    <post-list :posts="threadPosts"/>

    <post-editor v-if="authUser" @save="addPost"/>
    <div v-else class="text-center" style="margin-bottom: 50px">
      <router-link :to="{name: 'SignIn', query: {redirectTo: $route.path}}">Sign In</router-link>
      or
      <router-link :to="{name: 'Register', query: {redirectTo: $route.path}}">Register</router-link>
      to reply.
    </div>
  </div>
</template>

<script>
import PostList from '@/components/PostList'
import PostEditor from '@/components/PostEditor'
import { mapActions, mapGetters } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'
import useNotifications from '@/composibles/useNotifications'
import difference from 'lodash/difference'

export default {
  name: 'ThreadShow',
  setup () {
    const { addNotification } = useNotifications()

    return { addNotification }
  },
  components: { PostEditor, PostList },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  mixins: [asyncDataStatus],
  computed: {
    ...mapGetters('auth', ['authUser']),
    threads () {
      return this.$store.state.threads.items
    },
    posts () {
      return this.$store.state.posts.items
    },
    thread () {
      return this.$store.getters['threads/thread'](this.id)
    },
    threadPosts () {
      return this.posts.filter(post => post.threadId === this.id)
    }
  },
  methods: {
    ...mapActions('posts', ['createPost', 'fetchPosts']),
    ...mapActions('threads', ['fetchThread']),
    ...mapActions('users', ['fetchUsers']),
    addPost (eventData) {
      const post = {
        ...eventData.post,
        threadId: this.id
      }

      this.createPost(post)
    },
    async fetchPostsWithUsers (ids) {
      // fetch the posts
      const posts = await this.fetchPosts({
        ids,
        onSnapshot: ({ isLocal, previousItem }) => {
          console.log(isLocal)
          if (!this.asyncDataStatus_ready || isLocal || (previousItem?.edited && !previousItem?.edited?.at)) return

          this.addNotification({ message: 'Thread recently updated', timeout: 5000 })
        }
      })

      // fetch the users associated with the posts
      const users = posts.map(post => post.userId).concat(this.thread.userId)
      await this.fetchUsers({ ids: users })
    }
  },
  async created () {
    // fetch the thread
    const thread = await this.fetchThread({
      id: this.id,
      onSnapshot: async ({ isLocal, item, previousItem }) => {
        if (!this.asyncDataStatus_ready || isLocal) return

        const newPostIds = difference(item.posts, previousItem.posts)
        const hasNewPosts = newPostIds.length > 0

        if (hasNewPosts) {
          await this.fetchPostsWithUsers(newPostIds)
        } else {
          this.addNotification({ message: 'Thread recently updated', timeout: 4000 })
        }
      }
    })

    await this.fetchPostsWithUsers(thread.posts)
    this.asyncDataStatus_fetched()
  }
}
</script>
