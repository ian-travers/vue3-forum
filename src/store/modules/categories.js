import firebase from 'firebase'

export default {
  state: {
    items: []
  },
  getters: {},
  actions: {
    fetchCategory: ({ dispatch }, { id }) => dispatch('fetchItem', { id, emoji: '🏷', resource: 'categories' }),
    fetchCategories: ({ dispatch }, { ids }) => dispatch('fetchItems', { ids, emoji: '🏷', resource: 'categories' }),
    fetchAllCategories ({ commit }) {
      // console.log('🔥', '🏷', 'all')

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
    }
  },
  mutations: {}
}
