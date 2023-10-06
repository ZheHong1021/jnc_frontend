<template>
  <v-container>
      <h6 class="text-h6 text-md-h5 font-weight-black">
        <v-icon icon="mdi-robot-vacuum" color="brown darken-2"></v-icon>
        設備列表
      </h6>
      <v-row class="py-4 d-flex">
        <v-col v-for="device in devices" :key="device['id']" cols="12" md="6" lg="4" xl="3">
          <v-card elevation="10" color="indigo" variant="tonal">
            <v-card-text class="py-4 d-flex flex-wrap">
                <!-- Title -->
                <h5 class="text-subtitle-1 text-md-h6 text-xl-h5 font-weight-black">{{ device['DeviceName'] }}</h5>
                <!-- 連線 -->
                <v-chip class="font-weight-bold ml-2" label 
                  :color="device['Connect'] ? 'green-darken-2' : 'grey-darken-2'" 
                  :prepend-icon="device['Connect'] ? 'mdi-lan-connect' : 'mdi-lan-disconnect'">
                    {{ device['Connect'] ? '已連線' : '尚未連線' }}
                </v-chip>

                <br>

                
                <v-divider class="my-4"></v-divider>

                <div class="d-flex flex-wrap" style="gap: 0.5rem;">
                  
                  <!-- 種類 -->
                  <v-chip class="font-weight-bold" label 
                    color="primary"  size="small"
                    prepend-icon="mdi-shape">
                      #{{ device['JNCDevice'] }}
                  </v-chip>
                  <!-- USB -->
                  <v-chip class="font-weight-bold" label 
                    color="blue" variant="outlined" size="small"
                    prepend-icon="mdi-star">
                      USB: {{ device['USB'] }}
                  </v-chip>
                  <!-- SIM -->
                  <v-chip class="font-weight-bold" label 
                    color="red" variant="outlined" size="small"
                    prepend-icon="mdi-star">
                      SIM: {{ device['SIM'] }}
                  </v-chip>
                </div>

            </v-card-text>
          </v-card>
        </v-col>
        
      </v-row>
  </v-container>
</template>



<script>
import { apiGetDevices } from "@/api/"
import { onMounted, ref } from 'vue'
export default {
  name: 'Home',
  components: {
  },

  setup(){

    const devices = ref([])
    // 設備列表
    const getDevices = async ()=>{
      try{
        const response = await apiGetDevices()
        if(response.status === 200){
          const response_data = response['data']
          console.log(response_data);
          devices.value = response_data
        }
      }catch(err){
        console.log(err);
      }
    }

    // 初始化
    onMounted( ()=>{
      getDevices()
    })

    
    return {
      /* data */
      devices

    }

  },


};
</script>
