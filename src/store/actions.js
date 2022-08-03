import firebase from 'firebase'
import { findById } from '@/helpers'

export default {
  fetchItem ({ state, commit }, { id, emoji, resource, handleUnsubscribe = null, once = null, onSnapshot = null }) {
    console.log('🔥', emoji, id)

    return new Promise((resolve) => {
      const unsubscribe = firebase.firestore().collection(resource).doc(id).onSnapshot((doc) => {
        if (once) unsubscribe()

        if (doc.exists) {
          const item = { ...doc.data(), id: doc.id }
          let previousItem = findById(state[resource].items, id)
          previousItem = previousItem ? { ...previousItem } : null
          commit('setItem', { resource, item })

          if (typeof onSnapshot === 'function') {
            onSnapshot({ item: { ...item }, previousItem })
          }
          resolve(item)
        } else {
          resolve(null)
        }
      })

      if (handleUnsubscribe) {
        handleUnsubscribe(unsubscribe)
      } else {
        commit('appendUnsubscribe', { unsubscribe })
      }
    })
  },

  fetchItems ({ dispatch }, { ids, emoji, resource, onSnapshot = null }) {
    return Promise.all(ids.map(id => dispatch('fetchItem', { id, emoji, resource, onSnapshot })))
  },

  async unsubscribeAllSnapshots ({ state, commit }) {
    state.unsubscribes.forEach(unsubscribe => unsubscribe())
    commit('clearAllUnsubscribes')
  }
}
