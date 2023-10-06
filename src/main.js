import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'



// Vuetify
// import vuetify from './plugins/vuetify'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
const icons = {
  defaultSet: 'mdi',
  aliases,
  sets: {
    mdi,
  }
}

const vuetify = createVuetify({
  icons,
  theme: {
    defaultTheme: 'light', // light / dark
    //
  },
  components,
  directives,
})

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