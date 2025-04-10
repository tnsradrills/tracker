import { createRouter, createWebHistory } from 'vue-router';

import LandingPage from '@/views/LandingPage.vue';

const routes = [
  {
    path: '/',
    name: 'Welcome',
    component: LandingPage,
  },
  // {
  //   path: '/login',
  //   name: 'Login',
  //   component: Login,
  // },
  // {
  //   path: '/dashboard',
  //   name: 'Dashboard',
  //   component: Dashboard,
  // },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;