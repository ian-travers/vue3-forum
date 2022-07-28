import { makeAppendChildToParentMutation } from '@/helpers'

export default {
  state: {
    items: []
  },
  getters: {},
  actions: {
    fetchForum: ({ dispatch }, { id }) => dispatch('fetchItem', { id, emoji: '🗄', resource: 'forums' }),
    fetchForums: ({ dispatch }, { ids }) => dispatch('fetchItems', { ids, emoji: '🗄', resource: 'forums' })
  },
  mutations: {
    appendThreadToForum: makeAppendChildToParentMutation({ parent: 'forums', child: 'threads' })
  }
}
