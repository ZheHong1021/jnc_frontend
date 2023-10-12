<template>
  <v-container>
      <h6 class="text-h6 text-md-h5 font-weight-black">
        <v-icon icon="mdi-robot-vacuum" color="brown darken-2"></v-icon>
        場域列表
      </h6>
      <v-row class="py-4 d-flex">
         
        
        <v-col v-for="position in positions" :key="position['id']" cols="12" md="6" lg="4" xl="3">
          <v-skeleton-loader
              :loading="position_loading"
              height="180"
              type="image">
              <v-hover>
                <template v-slot:default="{ isHovering, props }">
                    <v-card v-bind="props" :color="isHovering ? 'blue-accent-2' : 'indigo'" 
                      elevation="10" 
                      variant="tonal" 
                      class="pointer"
                      @click="goDirect(position['id'])">

                      <v-card-text class="py-4 d-flex flex-wrap">
                          <!-- Title -->
                          <h5 class="text-subtitle-1 text-md-h6 text-xl-h5 font-weight-black">{{ position['DeviceName'] }}</h5>
                          <!-- 連線 -->
                          <v-chip class="font-weight-bold ml-2" label 
                            :color="position['Connect'] ? 'green-darken-2' : 'grey-darken-2'" 
                            :prepend-icon="position['Connect'] ? 'mdi-lan-connect' : 'mdi-lan-disconnect'">
                              {{ position['Connect'] ? '已連線' : '尚未連線' }}
                          </v-chip>

                          <br>

                          <v-divider class="my-4"></v-divider>

                          <div class="d-flex flex-wrap" style="gap: 0.5rem;">
                            
                            <!-- 種類 -->
                            <v-chip class="font-weight-bold" label 
                              color="primary"  size="small"
                              prepend-icon="mdi-shape">
                                #{{ position['JNCDevice'] }}
                            </v-chip>

                            <!-- USB -->
                            <v-chip class="font-weight-bold" label 
                              color="blue" variant="outlined" size="small"
                              prepend-icon="mdi-star">
                                USB: {{ position['USB'] }}
                            </v-chip>

                            <!-- SIM -->
                            <v-chip class="font-weight-bold" label 
                              color="red" variant="outlined" size="small"
                              prepend-icon="mdi-star">
                                SIM: {{ position['SIM'] }}
                            </v-chip>
                          </div>

                      </v-card-text>
                    </v-card>
                </template>
              </v-hover>
          </v-skeleton-loader>

        </v-col>
        
      </v-row>
  </v-container>
</template>



<script>
/* 呼叫API */
import { apiGetPositions } from "@/api/"

/* 引用 Vue */
import { onMounted, ref } from 'vue'

/* 引用路由 */
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'JNCPosition',
  components: {
  },

  setup(){
    /* 【Access Route inside setup】 */
    const router = useRouter()
    const route = useRoute()

     // 初始化
    onMounted( ()=>{
      position_loading.value = true
      getPositions()
    })

    const positions = ref([]) // 用於
    const position_loading = ref(false)
    // 場域列表
    const getPositions = async ()=>{
      try{
        const response = await apiGetPositions()
        if(response.status === 200){
          const response_data = response['data']
          positions.value = response_data
        }
      }catch(err){
        console.log(err);
      }
      finally{
        setTimeout(() => {
          position_loading.value = false
        }, 500);
      }
    }

   


    /* 導引頁面 */
    const goDirect = (id)=>{
      router.push({
        name: 'JNCDevice',
        params: {
          id: id,
        },
      })
    }

    
    return {
      /* data */
      positions, position_loading,

      /* Method */
      goDirect,
    }
  },
};
</script>


<style scoped>


</style>