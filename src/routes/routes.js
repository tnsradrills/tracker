import { createRouter, createWebHistory } from "vue-router";
import { supabase } from "@/stores/supabase.js";

const routes = [
  {
    path: "/",
    name: "Welcome",
    component: () => import("@/views/LandingPage.vue"),
    meta: { guestOnly: true },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("@/views/DashboardPage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/leaderboard",
    name: "Leaderboard",
    component: () => import("@/views/LeaderBoard.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/record-new",
    name: "Record New",
    component: () => import("@/views/RecordNew.vue"),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

router.beforeEach(async (to, from, next) => {
  const { data } = await supabase.auth.getSession();
  const isLoggedIn = !!data.session;

  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ path: "/" });
  } else if (to.meta.guestOnly && isLoggedIn) {
    next({ path: "/dashboard" });
  } else {
    next();
  }
});
