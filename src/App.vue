<template>

  <v-app id="inspire">
    <!-- 側邊欄 -->
    <v-navigation-drawer v-model="drawer">
      <Navigation />
    </v-navigation-drawer>

    <!-- 頂端 -->
    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <!-- Bar Title -->
      <v-app-bar-title class="font-weight-black">{{app_name}}</v-app-bar-title>
    </v-app-bar>

    <!-- 主頁面 -->
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>


<script>
import Navigation from "@/components/Navigation.vue"
  export default {
    name: 'Navigation',
    components: {
      Navigation
    }
  }
</script>

<script setup>
  import { ref } from 'vue'
  const drawer = ref(null)
  const app_name = ref("JNC 監測系統")
</script>



<style>


  .pointer{ /* 點擊按鈕變換(通常都會使用到) => 放置在全域 */
    cursor: pointer;
  }

</style>