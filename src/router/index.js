import { createRouter, createWebHistory } from 'vue-router';

import { h } from 'vue'
import { RouterView } from 'vue-router'

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


  // https://stackoverflow.com/questions/67375247/vue-3-router-router-link-active-not-working
  {
    path: '/jnc-position',
    component: { render: () => h(RouterView) },
    children: [
      { // 區域列表
        path: '',
        name: 'JNCPosition',
        component: loadView("JNC/JNCPosition")
      },
      { // 設備列表
        path: '/:id/devices',
        name: 'JNCDevice',
        component: loadView("JNC/JNCDevice"),
      }
    ]
  },


  
  { // 測試
    path: '/direction',
    name: 'Direction',
    component: loadView("Direction"),
  },
  { // 測試
    path: '/table',
    name: 'Table',
    component: loadView("Table"),
  },

  

  // 404 Not Found
  // /:pathMatch(.*)*: 最終都會指向該Component，上面路由條件都沒達到時
  { 
    path: '/:pathMatch(.*)*',
    name: '404NotFound',
    component: loadView("404NotFound"),
  },
];


// Hisotry API
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
