<template>
  <div v-if="asyncDataStatus_ready" class="col-full push-top">
    <AppHead>
      <title>{{forum?.name}}</title>
      <meta property="og:title" :content="forum?.name">
      <meta name="twitter:title" :content="forum?.name">
    </AppHead>
    <div class="forum-header">
      <div class="forum-details">
        <h1>{{ forum.name }}</h1>
        <p class="text-lead">{{ forum.description }}</p>
      </div>
      <router-link
        :to="{name: 'ThreadCreate', params: { forumId: forum.id }}"
        class="btn-green btn-small"
      >
        Start a thread
      </router-link>
    </div>
    <div class="push-top">
      <ThreadList :threads="threads"/>
      <VPagination
        v-model="page"
        :pages="totalPages"
        active-color="#57ad8d"
      />
    </div>
  </div>
</template>

<script>
import ThreadList from '@/components/ThreadList'
import { findById } from '@/helpers'
import { mapActions } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'

export default {
  name: 'ForumItem',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      page: parseInt(this.$route.query.page) || 1,
      perPage: 10
    }
  },
  mixins: [asyncDataStatus],
  components: {
    ThreadList
  },
  computed: {
    forum () {
      return findById(this.$store.state.forums.items, this.id)
    },
    threads () {
      if (!this.forum) return []

      // return this.forum.threads.map(threadId => this.$store.getters['threads/thread'](threadId))
      return this.$store.state.threads.items
        .filter(thread => thread.forumId === this.forum.id)
        .map(thread => this.$store.getters['threads/thread'](thread.id))
    },
    threadsCount () {
      return this.forum.threads?.length || 0
    },
    totalPages () {
      if (!this.threadsCount) return 0

      return Math.ceil(this.threadsCount / this.perPage)
    }
  },
  watch: {
    async page (page) {
      this.$router.push({ query: { page: this.page } })
    }
  },
  methods: {
    ...mapActions('forums', ['fetchForum']),
    ...mapActions('threads', ['fetchThreadsByPage']),
    ...mapActions('users', ['fetchUsers'])
  },
  async created () {
    const forum = await this.fetchForum({ id: this.id })
    const threads = await this.fetchThreadsByPage({ ids: forum.threads, page: this.page, perPage: this.perPage })
    await this.fetchUsers({ ids: threads.map(thread => thread.userId) })
    this.asyncDataStatus_fetched()
  }
}
</script>
