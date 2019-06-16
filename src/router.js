import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Signin from '@/components/Signin'
import Editor from '@/components/Editor'
import NotFound from '@/components/NotFound'
import BootstrapVue from 'bootstrap-vue'

Vue.use(Router)
Vue.use(BootstrapVue)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
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
    },
    {
      path: '*',
      component: NotFound
    }
  ]
})
