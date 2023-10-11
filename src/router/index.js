import { createRouter, createWebHistory } from 'vue-router';

// 用來載入 view的函式
function loadView(view) {
  return () => import(`@/views/${view}.vue`);
}

const routes = [
  { // 首頁
    path: '/',
    name: 'home',
    component: loadView("Home"),
  },
  { // 區域列表
    path: '/jnc-position',
    name: 'JNCPosition',
    component: loadView("JNC/JNCPosition"),
  },
  { // 設備列表
    path: '/jnc-position/:id/devices',
    name: 'JNCDevice',
    component: loadView("JNC/JNCDevice"),
  },

  
  { // 測試
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
