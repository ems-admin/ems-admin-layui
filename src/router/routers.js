import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'

export const routerMap = [
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../login.vue')
  },
  {
    path: '/index',
    name: 'index',
    component: () => import('../index.vue')
  },
  {
    path: '/401',
    name: '401',
    component: () => import('../views/error/401')
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../views/error/404')
  }
]

const routers = createRouter({
  history: createWebHistory(),
  routes: routerMap
})

export default routers
