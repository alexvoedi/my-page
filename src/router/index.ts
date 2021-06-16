import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/maze",
    name: "MazeGenerator",
    component: () => import("../views/MazeGenerator/MazeGenerator.vue"),
  },
  {
    path: "/pso",
    name: "ParticleSwarmOptimization",
    component: () =>
      import(
        "../views/ParticleSwarmOptimization/ParticleSwarmOptimization.vue"
      ),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
