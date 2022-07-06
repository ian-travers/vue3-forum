import { createApp } from 'vue'
import App from './App.vue'
import PageHome from '@/components/PageHome'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: PageHome
  }
]

const router = createRouter({
  // Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory(),
  routes // short for `routes: routes`
})

const forumApp = createApp(App)
forumApp.use(router)
forumApp.mount('#app')
