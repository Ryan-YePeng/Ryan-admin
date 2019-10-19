import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

const constantRouterMap = [
  {path: '/404', name: 'error404', component: () => import('../views/error/index')},
  {path: '/403', name: 'error403', component: () => import('../views/error/index')},
  {path: '/login', name: 'login', component: () => import('../views/login')}
];

export default new Router({
 // mode: 'history',
  routes: constantRouterMap
})
