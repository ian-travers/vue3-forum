import { defineRule } from 'vee-validate'

export default (app) => {
  defineRule('required', (value) => {
    if (value && value.trim()) return true
    return 'This is required'
  })
}
