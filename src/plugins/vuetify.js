import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// 未完全完成的Component(測試用)
import * as labsComponents from 'vuetify/labs/components'

/* 使用圖案(Material Design Icon) */
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
const icons = {
  defaultSet: 'mdi',
  aliases,
  sets: {mdi},
}

export const vuetify = createVuetify({
  components:{
    ...components,
    ...labsComponents,
  },
  directives,
  icons,
  theme: {
    defaultTheme: 'light', // light / dark
  },
  
})
