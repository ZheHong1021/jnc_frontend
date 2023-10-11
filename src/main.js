import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


/* 【Vuetify】 */
import { vuetify } from '@/plugins/vuetify'
const app = createApp(App)
app.use(router)
app.use(store)
app.use(vuetify)



// 【發布 - Production】
// app.config.productionTip = true // true: 線上發布 / false: 測試
// app.config.devtools = false // true: 開啟Devtool / false: 關閉devtool

// 【測試 - Development】
app.config.productionTip = false // true: 線上發布 / false: 測試
app.config.devtools = true // true: 開啟Devtool / false: 關閉devtool

app.mount('#app')