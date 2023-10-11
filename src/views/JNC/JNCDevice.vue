<template>
  <v-container>
      <h6 class="text-h6 text-md-h5 font-weight-black">
        <v-icon icon="mdi-robot-vacuum" color="brown darken-2"></v-icon>
        設備列表 ({{position_id}})
      </h6>

      <v-row>
        <v-col cols="4">
        </v-col>

      </v-row>
  </v-container>
</template>



<script>
/* 引用 Vue */
import { computed, onMounted, ref } from 'vue'

/* 呼叫API */
import { apiGetSinglePosition } from "@/api/"

/* 引用路由 */
import { useRouter, useRoute } from 'vue-router'
export default {
  name: 'JNCDevice',
  components: {
  },

  setup(){
    /* 【Access Route inside setup】 */
    const router = useRouter()
    const route = useRoute()
    
    /* 路由傳遞過來的 ID */
    const position_id = computed(()=> route.params.id)
   
    // 初始化
    onMounted( ()=>{
      getSinglePosition()
    })


    const loading = ref(false)

        // 單一場域(含檢測項目列表)
    const getSinglePosition = async ()=>{
      console.log(position_id.value);
      try{
        const response = await apiGetSinglePosition(position_id.value)
        if(response.status === 200){
          const response_data = response['data']
          console.log(response_data);
        }
      }catch(err){
        console.log(err);
      }
      finally{
        setTimeout(() => {
          loading.value = false
        }, 500);
      }
    }

    
    return {
      position_id
    }
  },
};
</script>


<style scoped>


</style>