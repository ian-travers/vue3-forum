import { createStore } from 'vuex'
import sourceData from '@/data.json'

export default createStore({
  state: {
    ...sourceData,
    authId: 'f5xvKdIPQdSrUtT6i3UiHYttRXO2'
  },
  getters: {
    authUser: state => state.users.find(user => user.id === state.authId)
  },
  actions: {
    createPost (context, post) {
      post.id = 'ggg' + Math.random()
      context.commit('createPost', { post }) // set the post
      context.commit('appendPostToThread', { postId: post.id, threadId: post.threadId }) // append post to thread
    }
  },
  mutations: {
    createPost (state, { post }) {
      state.posts.push(post)
    },
    appendPostToThread (state, { postId, threadId }) {
      const thread = state.threads.find(thread => thread.id === threadId)
      thread.posts.push(postId)
    }
  }
})