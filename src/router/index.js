import Home from '@/pages/TheHome'
import ThreadShow from '@/pages/ThreadShow'
import ThreadCreate from '@/pages/ThreadCreate'
import ThreadEdit from '@/pages/ThreadEdit'
import NotFound from '@/pages/NotFound'
import Forum from '@/pages/Forum'
import Category from '@/pages/Category'
import Profile from '@/pages/Profile'
import Register from '@/pages/Register'
import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/me',
    name: 'Profile',
    component: Profile,
    meta: { toTop: true, smoothScroll: true }
  },
  {
    path: '/me/edit',
    name: 'ProfileEdit',
    component: Profile,
    props: { edit: true }
  },
  {
    path: '/category/:id',
    name: 'Category',
    component: Category,
    props: true
  },
  {
    path: '/forum/:id',
    name: 'Forum',
    component: Forum,
    props: true
  },
  {
    path: '/thread/:id',
    name: 'ThreadShow',
    component: ThreadShow,
    props: true
    // beforeEnter (to, from, next) {
    //   const threadExists = sourceData.threads.find(thread => thread.id === to.params.id)
    //
    //   return threadExists
    //     ? next()
    //     : next({
    //       name: 'NotFound',
    //       params: { pathMatch: to.path.substring(1).split('/') },
    //       // preserve existing query and hash
    //       query: to.query,
    //       hash: to.hash
    //     })
    // }
  },
  {
    path: '/forum/:forumId/thread/create',
    name: 'ThreadCreate',
    component: ThreadCreate,
    props: true
  },
  {
    path: '/thread/:id/edit',
    name: 'ThreadEdit',
    component: ThreadEdit,
    props: true
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  // Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory(),
  routes, // short for `routes: routes`
  scrollBehavior (to) {
    const scroll = {}

    if (to.meta.toTop) scroll.top = 0
    if (to.meta.smoothScroll) scroll.behavior = 'smooth'

    return scroll
  }
})

router.beforeEach(() => {
  store.dispatch('unsubscribeAllSnapshots')
})

export default router
