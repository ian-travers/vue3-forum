<template>
  <div class="col-large push-top">
    <h1>{{ thread.title }}</h1>

    <post-list :posts="threadPosts"/>

    <div class="col-full">
      <form @submit.prevent="addPost">
        <div class="form-group">
          <textarea
            v-model="newPostText"
            class="form-input"
          />
        </div>
        <div class="form-actions">
          <button class="btn-blue">Submit Post</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import sourceData from '@/data.json'
import PostList from '@/components/PostList'

export default {
  name: 'ThreadShow',
  components: { PostList },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      threads: sourceData.threads,
      posts: sourceData.posts,
      newPostText: ''
    }
  },
  computed: {
    thread () {
      return this.threads.find(thread => thread.id === this.id)
    },
    threadPosts () {
      return this.posts.filter(post => post.threadId === this.id)
    }
  },
  methods: {
    addPost () {
      const postId = 'ggg' + Math.random()

      const post = {
        id: postId,
        text: this.newPostText,
        publishedAt: Math.floor(Date.now() / 1000),
        threadId: this.id,
        userId: 'ALXhxjwgY9PinwNGHpfai6OWyDu2'
      }

      this.posts.push(post)
      this.thread.posts.push(postId)

      this.newPostText = ''
    }
  }
}
</script>