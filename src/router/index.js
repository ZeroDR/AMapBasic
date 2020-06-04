import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/views/main'
import PortalVue from 'portal-vue'

Vue.use(Router);
Vue.use(PortalVue);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main
    }
  ]
})
