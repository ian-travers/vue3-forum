<template>
  <div class="col-full">
    <form @submit.prevent="save">
      <div class="form-group">
          <textarea
            v-model="text"
            class="form-input"
          />
      </div>
      <div class="form-actions">
        <button class="btn-blue">Submit Post</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'PostEditor',
  data () {
    return {
      text: ''
    }
  },
  methods: {
    save () {
      const post = {
        text: this.text,
        publishedAt: Math.floor(Date.now() / 1000),
        userId: 'HJNTR1nN8tgbB148RJrPYbby8Vl1'
      }

      this.$emit('save', { post })
      this.text = ''
    }
  }
}
</script>
