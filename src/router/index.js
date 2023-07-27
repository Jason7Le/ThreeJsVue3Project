import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/demoGather',
      name: 'demoGather',
      component: () => import('../views/DemoGather.vue')
    },
    {
      path: '/ThreeJS',
      name: 'ThreeJS',
      component: () => import('../views/ThreeJSDemo.vue')
    },
    {
      path: '/save3DFileToPicture',
      name: 'save3DFileToPicture',
      component: () => import('../views/save3DFileToPicture.vue')
    },
    {
      path: '/load3DmodelFile',
      name: 'load3DmodelFile',
      component: () => import('../views/load3DmodelFile.vue')
    },
    {
      path: '/LabelInformation',
      name: 'LabelInformation',
      component: () => import('../views/LabelInformation.vue')
    },
    {
      path: '/Raycaster',
      name: 'Raycaster',
      component: () => import('../views/Raycaster.vue')
    },
    
    
    
    
  ]
})

export default router
