import { findById } from '@/helpers'
import firebase from 'firebase'

export default {
  createPost ({ commit, state }, post) {
    post.id = 'ggg' + Math.random()
    post.userId = state.authId
    post.publishedAt = Math.floor(Date.now() / 1000)
    commit('setItem', { resource: 'posts', item: post }) // set the post
    commit('appendPostToThread', { childId: post.id, parentId: post.threadId }) // append post to thread
    commit('appendContributorToThread', { childId: state.authId, parentId: post.threadId })
  },
  async createThread ({ commit, state, dispatch }, { text, title, forumId }) {
    const id = 'ggg' + Math.random()
    const userId = state.authId
    const publishedAt = Math.floor(Date.now() / 1000)
    const thread = { forumId, title, publishedAt, userId, id }
    commit('setItem', { resource: 'threads', item: thread })
    commit('appendThreadToForum', { childId: id, parentId: forumId })
    commit('appendThreadToUser', { childId: id, parentId: userId })
    dispatch('createPost', { text, threadId: id })

    return findById(state.threads, id)
  },
  async updateThread ({ commit, state }, { title, text, id }) {
    const thread = findById(state.threads, id)
    const post = findById(state.posts, thread.posts[0])
    const newThread = { ...thread, title }
    const newPost = { ...post, text }
    commit('setItem', { resource: 'threads', item: newThread })
    commit('setItem', { resource: 'posts', item: newPost })

    return newThread
  },
  updateUser ({ commit }, user) {
    commit('setUser', { resource: 'users', item: user })
  },

  // ---------------------
  // Fetch Single Resource
  // ---------------------
  fetchCategory ({ dispatch }, { id }) {
    return dispatch('fetchItem', { id, emoji: '🏷', resource: 'categories' })
  },
  fetchForum ({ dispatch }, { id }) {
    return dispatch('fetchItem', { id, emoji: '🗄', resource: 'forums' })
  },
  fetchThread ({ dispatch }, { id }) {
    return dispatch('fetchItem', { id, emoji: '📄', resource: 'threads' })
  },
  fetchPost ({ dispatch }, { id }) {
    return dispatch('fetchItem', { id, emoji: '💬', resource: 'posts' })
  },
  fetchUser ({ dispatch }, { id }) {
    return dispatch('fetchItem', { id, emoji: '🙋', resource: 'users' })
  },

  fetchAllCategories ({ commit }) {
    console.log('🔥', '🏷', 'all')

    return new Promise((resolve) => {
      firebase.firestore().collection('categories').onSnapshot((querySnapshot) => {
        const categories = querySnapshot.docs.map(doc => {
          const item = { id: doc.id, ...doc.data() }
          commit('setItem', { resource: 'categories', item })

          return item
        })

        resolve(categories)
      })
    })
  },

  // ---------------------
  // Fetch Multiple Resources
  // ---------------------
  fetchCategories ({ dispatch }, { ids }) {
    return dispatch('fetchItems', { ids, emoji: '🏷', resource: 'categories' })
  },
  fetchForums ({ dispatch }, { ids }) {
    return dispatch('fetchItems', { ids, emoji: '🗄', resource: 'forums' })
  },
  fetchThreads ({ dispatch }, { ids }) {
    return dispatch('fetchItems', { ids, emoji: '📄', resource: 'threads' })
  },
  fetchPosts ({ dispatch }, { ids }) {
    return dispatch('fetchItems', { ids, emoji: '💬', resource: 'posts' })
  },
  fetchUsers ({ dispatch }, { ids }) {
    return dispatch('fetchItems', { ids, emoji: '🙋', resource: 'users' })
  },

  fetchItem ({ state, commit }, { id, emoji, resource }) {
    console.log('🔥', emoji, id)

    return new Promise((resolve) => {
      firebase.firestore().collection(resource).doc(id).onSnapshot((doc) => {
        const item = { ...doc.data(), id: doc.id }
        commit('setItem', { resource, item })
        resolve(item)
      })
    })
  },
  fetchItems ({ dispatch }, { ids, emoji, resource }) {
    return Promise.all(ids.map(id => dispatch('fetchItem', { id, emoji, resource })))
  }
}
