import { createStore } from 'vuex'
import getters from '@/store/getters'
import actions from '@/store/actions'
import mutations from '@/store/mutations'

export default createStore({
  state: {
    categories: [],
    forums: [],
    threads: [],
    posts: [],
    users: [],
    authId: 'f5xvKdIPQdSrUtT6i3UiHYttRXO2'
  },
  getters,
  actions,
  mutations
})
