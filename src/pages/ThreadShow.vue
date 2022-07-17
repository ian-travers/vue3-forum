<template>
  <div class="col-large push-top">
    <h1>
      {{ thread.title }}
      <router-link
        :to="{ name: 'ThreadEdit', id: this.id }"
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

    <post-editor @save="addPost"/>
  </div>
</template>

<script>
import PostList from '@/components/PostList'
import PostEditor from '@/components/PostEditor'
import firebase from 'firebase'

export default {
  name: 'ThreadShow',
  components: { PostEditor, PostList },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    threads () {
      return this.$store.state.threads
    },
    posts () {
      return this.$store.state.posts
    },
    thread () {
      return this.$store.getters.thread(this.id)
    },
    threadPosts () {
      return this.posts.filter(post => post.threadId === this.id)
    }
  },
  methods: {
    addPost (eventData) {
      const post = {
        ...eventData.post,
        threadId: this.id
      }

      this.$store.dispatch('createPost', post)
    }
  },
  async created () {
    // fetch the thread
    const thread = await this.$store.dispatch('fetchThread', { id: this.id })

    // fetch the user
    this.$store.dispatch('fetchUser', { id: thread.userId })

    // fetch the posts
    thread.posts.forEach(postId => {
      firebase.firestore().collection('posts').doc(postId).onSnapshot((doc) => {
        const post = { ...doc.data(), id: doc.id }
        this.$store.commit('setPost', { post })
        // fetch the author of the post
        this.$store.dispatch('fetchUser', { id: post.userId })
      })
    })
  }
}
</script>
