<template>
  <VeeForm @submit="save">
    <AppFormField v-model="form.title" name="title" label="Title" rules="required"/>
    <AppFormField v-model="form.text" name="text" label="Content" rules="required" as="textarea" rows="8"/>

    <div class="btn-group">
      <button class="btn btn-ghost" @click="$emit('cancel')">Cancel</button>
      <button class="btn btn-blue" type="submit">{{ existing ? 'Update' : 'Publish' }}</button>
    </div>
  </VeeForm>
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
      this.$emit('clean')
      this.$emit('save', { ...this.form })
    }
  },
  watch: {
    form: {
      handler () {
        if (this.form.title !== this.title || this.form.text !== this.text) {
          this.$emit('dirty')
        } else {
          this.$emit('clean')
        }
      },
      deep: true
    }
  }
}
</script>
