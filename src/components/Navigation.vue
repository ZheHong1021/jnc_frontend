<template>
    <div>
        <v-sheet color="grey-lighten-4" class="px-6 py-8">
            <v-row align="center" style="column-gap: 0.5rem;">
                <v-avatar color="grey-darken-2" size="48">
                  <v-icon icon="mdi-account"></v-icon>
                </v-avatar>
                <h6 class="font-weight-black text-black text-h6">測試開發</h6>
            </v-row>
        </v-sheet>

          <v-divider></v-divider>

          <v-list>
              <!-- Prefix + Icon (Material Design ICON) -->
              <v-list-item link nav
                v-for="route in routes" :key="route['title']"
                :prepend-icon="icon_prefix + '-' + route['icon']"
                :title="route['title']"
                :to="{name: route['routeName']}"
                :value="route['routeName']"
                active-class="bg-primary white--text font-weight-black"
              ></v-list-item>
          </v-list>

    </div>
</template>

<script>
  export default {
    name: 'Navigation',
  }
</script>

<script setup>
import { ref } from 'vue'
  
  // 前綴
  const icon_prefix = ref('mdi')

  // 路由列表 (標題內容、圖案、連結)
  const routes = ref([
    { title: '首頁', icon: 'inbox-arrow-down', routeName: 'home' },
    { title: '區域列表', icon: 'office-building-marker', routeName: 'JNCPosition' },
    { title: '測試頁面', icon: 'send', routeName: 'Direction' },
    // { title: '表格', icon: 'table', routeName: 'Table' },
  ])
</script>