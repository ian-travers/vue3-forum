import { findById } from '@/helpers'
import firebase from 'firebase'

export default {
  async createPost ({ commit, state }, post) {
    post.userId = state.authId
    post.publishedAt = Math.floor(Date.now() / 1000)

    const newPost = await firebase.firestore().collection('posts').add(post)
    await firebase.firestore().collection('threads').doc(post.threadId).update({
      posts: firebase.firestore.FieldValue.arrayUnion(newPost.id),
      contributors: firebase.firestore.FieldValue.arrayUnion(state.authId)
    })
    commit('setItem', { resource: 'posts', item: { ...post, id: newPost.id } }) // set the post
    commit('appendPostToThread', { childId: newPost.id, parentId: post.threadId }) // append post to thread
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
  fetchCategory: ({ dispatch }, { id }) => dispatch('fetchItem', { id, emoji: '🏷', resource: 'categories' }),
  fetchForum: ({ dispatch }, { id }) => dispatch('fetchItem', { id, emoji: '🗄', resource: 'forums' }),
  fetchThread: ({ dispatch }, { id }) => dispatch('fetchItem', { id, emoji: '📄', resource: 'threads' }),
  fetchPost: ({ dispatch }, { id }) => dispatch('fetchItem', { id, emoji: '💬', resource: 'posts' }),
  fetchUser: ({ dispatch }, { id }) => dispatch('fetchItem', { id, emoji: '🙋', resource: 'users' }),
  fetchAuthUser: ({ dispatch, state }) => dispatch('fetchItem', { id: state.authId, emoji: '🙋', resource: 'users' }),

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
  fetchCategories: ({ dispatch }, { ids }) => dispatch('fetchItems', { ids, emoji: '🏷', resource: 'categories' }),
  fetchForums: ({ dispatch }, { ids }) => dispatch('fetchItems', { ids, emoji: '🗄', resource: 'forums' }),
  fetchThreads: ({ dispatch }, { ids }) => dispatch('fetchItems', { ids, emoji: '📄', resource: 'threads' }),
  fetchPosts: ({ dispatch }, { ids }) => dispatch('fetchItems', { ids, emoji: '💬', resource: 'posts' }),
  fetchUsers: ({ dispatch }, { ids }) => dispatch('fetchItems', { ids, emoji: '🙋', resource: 'users' }),

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
