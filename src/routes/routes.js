import { createRouter, createWebHistory } from "vue-router";

import LandingPage from "@/views/LandingPage.vue";
import DashboardPage from "@/views/DashboardPage.vue";
const routes = [
  {
    path: "/",
    name: "Welcome",
    component: LandingPage,
  },
  // {
  //   path: '/login',
  //   name: 'Login',
  //   component: Login,
  // },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: DashboardPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
