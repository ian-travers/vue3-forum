<template>
  <form @submit.prevent="save">
    <div class="form-group">
      <label for="thread_title">Title:</label>
      <input
        v-model="form.title"
        type="text"
        id="thread_title"
        class="form-input"
      >
    </div>

    <div class="form-group">
      <label for="thread_content">Content:</label>
      <textarea
        v-model="form.text"
        id="thread_content"
        class="form-input"
      ></textarea>
    </div>

    <div class="btn-group">
      <button class="btn btn-ghost" @click="$emit('cancel')">Cancel</button>
      <button class="btn btn-blue" type="submit">{{ existing ? 'Update' : 'Publish' }}</button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'ThreadEditor',
  props: {
    title: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      form: {
        title: this.title,
        text: this.text
      }
    }
  },
  computed: {
    existing () {
      return !!this.title // !! do cast to boolean
    }
  },
  methods: {
    save () {
      this.$emit('save', { ...this.form })
    }
  }
}
</script>
