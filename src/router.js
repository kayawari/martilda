import Vue from 'vue'
import Router from 'vue-router'
import Signin from '@/components/Signin'
import Editor from '@/components/Editor'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/signin',
      name: 'Signin',
      component: Signin
    },
    {
      path: '/editor',
      name: 'Editor',
      component: Editor,
      meta: { requireAuth: true }
    }
  ]
})
