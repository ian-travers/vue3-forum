<template>
  <div v-if="asyncDataStatus_ready" class="container">
    <h1 class="push-top">Welcome to the Vue Masterclass Forum </h1>
    <div class="col-full">
      <CategoryList :categories="categories"/>
    </div>
  </div>
</template>

<script>
import CategoryList from '@/components/CategoryList'
import { mapActions } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'

export default {
  components: {
    CategoryList
  },
  mixins: [asyncDataStatus],
  computed: {
    categories () {
      return this.$store.state.categories.items
    }
  },
  methods: {
    ...mapActions('categories', ['fetchAllCategories']),
    ...mapActions('forums', ['fetchForums'])
  },
  async created () {
    const categories = await this.fetchAllCategories()
    const forumIds = categories.map(category => category.forums).flat() // !! flat()
    await this.fetchForums({ ids: forumIds })
    this.asyncDataStatus_fetched()
  }
}
</script>
