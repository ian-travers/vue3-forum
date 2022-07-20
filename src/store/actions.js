import { findById } from '@/helpers'
import firebase from 'firebase'

export default {
  async createPost ({ commit, state }, post) {
    post.userId = state.authId
    post.publishedAt = firebase.firestore.FieldValue.serverTimestamp()

    const batch = firebase.firestore().batch()
    const postRef = firebase.firestore().collection('posts').doc()
    const threadRef = firebase.firestore().collection('threads').doc(post.threadId)
    batch.set(postRef, post)
    batch.update(threadRef, {
      posts: firebase.firestore.FieldValue.arrayUnion(postRef.id),
      contributors: firebase.firestore.FieldValue.arrayUnion(state.authId)
    })
    await batch.commit()

    const newPost = await postRef.get()
    commit('setItem', { resource: 'posts', item: { ...newPost.data(), id: newPost.id } }) // set the post
    commit('appendPostToThread', { childId: newPost.id, parentId: post.threadId }) // append post to thread
    commit('appendContributorToThread', { childId: state.authId, parentId: post.threadId })
  },
  async createThread ({ commit, state, dispatch }, { text, title, forumId }) {
    const userId = state.authId
    const publishedAt = firebase.firestore.FieldValue.serverTimestamp()
    const threadRef = firebase.firestore().collection('threads').doc()
    const thread = { forumId, title, publishedAt, userId, id: threadRef.id }
    const userRef = firebase.firestore().collection('users').doc(userId)
    const forumRef = firebase.firestore().collection('forums').doc(forumId)

    const batch = firebase.firestore().batch()
    batch.set(threadRef, thread)
    batch.update(userRef, {
      threads: firebase.firestore.FieldValue.arrayUnion(threadRef.id)
    })
    batch.update(forumRef, {
      threads: firebase.firestore.FieldValue.arrayUnion(threadRef.id)
    })
    await batch.commit()

    const newThread = await threadRef.get()
    commit('setItem', { resource: 'threads', item: { ...newThread.data(), id: newThread.id } })
    commit('appendThreadToForum', { childId: threadRef.id, parentId: forumId })
    commit('appendThreadToUser', { childId: threadRef.id, parentId: userId })
    await dispatch('createPost', { text, threadId: threadRef.id })

    return findById(state.threads, threadRef.id)
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
