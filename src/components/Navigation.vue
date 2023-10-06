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

          <v-list nav>
              <v-list-item link
                v-for="route in routes" :key="route['title']"
                :prepend-icon="route['icon']"
                :title="route['title']"
                :to="route['link']"
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
  // script setup logic

  const routes = ref([
    { title: '首頁', icon: 'mdi-inbox-arrow-down', link: '/' },
    { title: '測試頁面', icon: 'mdi-send', link: '/direction' },
  
  ])
</script>