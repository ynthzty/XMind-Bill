import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'uploadPage',
    component: () => import('../components/UploadPage.vue')
  },
  {
    path: '/billPage',
    name: 'billPage',
    component: () => import('../components/BillPage.vue')
  }
  
]

const router = new VueRouter({
  routes
})

export default router
