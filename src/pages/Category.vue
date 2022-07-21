<template>
  <div v-if="asyncDataStatus_ready" class="container">
    <h1 class="push-top">{{ category.name }}</h1>
    <div class="col-full">
      <ForumList
        :title="category.name"
        :forums="getForumsForCategory(category)"
      />
    </div>
  </div>
</template>

<script>
import ForumList from '@/components/ForumList'
import { findById } from '@/helpers'
import { mapActions } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'

export default {
  name: 'CategoryItem',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  mixins: [asyncDataStatus],
  components: {
    ForumList
  },
  computed: {
    category () {
      return findById(this.$store.state.categories, this.id) || {}
    }
  },
  methods: {
    getForumsForCategory (category) {
      return this.$store.state.forums.filter(forum => forum.categoryId === category.id)
    },
    ...mapActions(['fetchCategory', 'fetchForums'])
  },
  async created () {
    const category = await this.fetchCategory({ id: this.id })
    await this.fetchForums({ ids: category.forums })
    this.asyncDataStatus_fetched()
  }
}
</script>
