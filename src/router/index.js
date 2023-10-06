import { createRouter, createWebHistory } from 'vue-router';

// 用來載入 view的函式
function loadView(view) {
  return () => import(`@/views/${view}.vue`);
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: loadView("Home"),
  },
  {
    path: '/direction',
    name: 'Direction',
    component: loadView("Direction"),
  },

];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
