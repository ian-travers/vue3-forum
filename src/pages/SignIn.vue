<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <VeeForm @submit="signIn" class="card card-form">
        <h1 class="text-center">Login</h1>

        <AppFormField v-model="form.email" name="email" label="Email" rules="required" type="email"/>
        <AppFormField v-model="form.password" name="password" label="Password" rules="required" type="password"/>

        <div class="push-top">
          <button type="submit" class="btn-blue btn-block">Log in</button>
        </div>

        <div class="form-actions text-right">
          <router-link :to="{name: 'Register'}">Create an Account?</router-link>
        </div>
      </VeeForm>

      <div class="push-top text-center">
        <button @click="signInWithGoogle" class="btn-red btn-xsmall">
          <i class="fa fa-google fa-btn"></i>Sign in with Google
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SignIn',
  data () {
    return {
      form: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    async signIn () {
      try {
        await this.$store.dispatch('auth/signInWithEmailAndPassword', { ...this.form })
        this.successRedirect()
      } catch (error) {
        alert(error.message)
      }
    },
    async signInWithGoogle () {
      await this.$store.dispatch('auth/signInWithGoogle')
      this.successRedirect()
    },
    successRedirect () {
      const redirectTo = this.$route.query.redirectTo || { name: 'Home' }
      this.$router.push(redirectTo)
    }
  },
  created () {
    this.$emit('ready')
  }
}
</script>
