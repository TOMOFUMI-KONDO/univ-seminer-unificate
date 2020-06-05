import Vue from 'vue'
import VueRouter from 'vue-router'
import { setTitle } from '../mixins'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Calendar',
    component: () => import('../views/Calendar'),
    meta: {title: 'イベントカレンダー'}
  },
  {
    path: '/in-session',
    name: 'InSession',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/InSession'),
    meta: {title: '開催中のイベント'}
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  setTitle(to.meta.title)
  next()
})

export default router
