<template>
  <v-container>

      <div class="d-flex">
        <h6 class="text-h6 text-md-h5 font-weight-black">
          <v-icon icon="mdi-robot-vacuum" color="brown darken-2"></v-icon>
          <!-- 設備列表 ({{position_id}}) -->
          {{position['DeviceName']}} 
        </h6>

        <v-spacer></v-spacer>
        <v-btn variant="flat" color="grey" class="font-weight-black"
          @click="$router.go(-1)">
          回上一頁
        </v-btn>
      </div>


      <p class="text-subtitle-1 font-weight-black text-blue">
        檢測項目: {{ position['inspect_num']}}
      </p>

      

      <v-row class="my-4" align="end">
        <!-- #region 項目選項 -->
        <v-col cols="12" sm="6" md="5" lg="4" xl="3">
          <v-select
            v-model="selected"
            label="選擇檢測項目"
            :items="position['inspects']"
            item-title="TagName"
            item-value="id"
            multiple
            variant="solo-filled" hide-details
            prepend-inner-icon="mdi-fan-auto">
            <!-- Selection Display -->
            <template v-slot:selection="{ item, index }">
                <div class="mt-2">
                    <v-chip v-if="index < 2" color="primary" class="font-weight-black">
                        <!-- item-title -->
                        {{ item['title'] }}
                    </v-chip>
                    <span v-if="index === 2" >
                        (+{{ selected.length - 2 }} others)
                    </span>
                </div>
            </template>

            <!-- Select All -->
            <template v-slot:prepend-item>
                <!-- 數量 -->
                <v-list-item>
                  <!-- prepend -->
                  <template v-slot:prepend>
                    <v-avatar color="amber-lighten-3">
                      <v-icon icon="mdi-monitor-dashboard" color="indigo"></v-icon>
                    </v-avatar>
                  </template>

                  <!-- title -->
                  <template v-slot:title>
                    <h6 class="font-weight-black text-subtitle-1">檢測項目 <strong class="text-red">(限選5個)</strong></h6>
                  </template>

                  <!-- Subtitle -->
                  <template v-slot:subtitle>
                    <div class="d-flex flex-wrap" style="gap: 0.5rem;">
                      <v-chip rounded small color="success" variant="tonal">
                        已選: {{ selected.length }}
                      </v-chip>
                      <v-chip rounded small color="deep-orange-darken-1" variant="tonal">
                        總共: {{ position['inspects'].length }}
                      </v-chip>
                    </div>
                  </template>
                  
                </v-list-item>
                <v-divider class="mt-2"></v-divider>
            </template>

            <!-- Selected Item -->
            <template #item="{ props, item }">
              <v-list-item v-bind="props" :disabled="selected.length >= 5 && !selected.includes(props.value)">
              <!-- <v-list-item v-bind="props" > -->
                <template v-slot:prepend="{isActive}">
                    <!-- 原生資料 -->
                    <!-- {{item.raw}} -->

                    <v-icon x-small
                      :icon="isActive ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'"
                      :color="isActive ? 'green' : 'red-accent-3'">
                    </v-icon>
                </template>
              </v-list-item>
                
            </template>

          </v-select>
        </v-col>
        <!-- #endregion -->

        <!-- #region日期選項 -->
        <v-col cols="12" sm="6" md="5" lg="4" xl="3">
          <v-menu
            v-model="date_menu"
            :close-on-content-click="false"
            transition="scale-transition"
            min-width="auto">
              <template v-slot:activator="{ props  }">
                  <v-text-field
                      v-model="date_text_field"
                      label="請選擇欲搜尋的紀錄日期"
                      prepend-inner-icon="mdi-calendar"
                      readonly v-bind="props"
                      outlined hide-details
                      clearable
                      @click:clear="cancelDateIdx"
                  ></v-text-field>
              </template>

              <v-date-picker elevation="24"
                title="選擇查詢的日期範圍"
                multiple
                bg-color="indigo-lighten-5"
                color="indigo"
                v-model="date_idx"
                :allowed-dates="allowedDates"
                ok-text="確認"
                cancel-text="清空"
                @click:save="saveDateIdx"
                @click:cancel="cancelDateIdx"
                @update:modelValue="updateDateIdx">
              </v-date-picker>
          </v-menu>
        </v-col>

        
        <!-- #endregion -->

        <!-- #region查詢 -->
        <v-col cols="12" sm="6" md="5" lg="4" xl="3">
          <v-btn variant="flat" color="success" @click="search"
            :loading="hisotry_loading">
              查詢
          </v-btn>
          <span class="font-weight-black">
            <v-icon icon="mdi-information" color="blue"></v-icon>
            預設: 『今天日期』
          </span>
        </v-col>
        <!-- #endregion -->

        <!-- #region 項目選項圖表內容 -->
        <v-col cols="12">
          <v-skeleton-loader
            v-if="hisotry_loading"
            class="mx-auto border"
            type="image@4"
          ></v-skeleton-loader>

          <InspectChart 
            v-else-if="!hisotry_loading && Object.keys(history_inspects).length > 0"
            :history_inspects="history_inspects"
          />

          <div v-else class="bg-grey-lighten-3 d-flex flex-column justify-center align-center" style="min-height: 20rem;">
            <v-icon icon="mdi-magnify-close" size="36" class="my-4"></v-icon>
            <h6 class="font-weight-black text-subtitle-1 text-md-h6">該日期查無資料</h6>
            
          </div>

        </v-col>
        <!-- #endregion -->

      </v-row>
  </v-container>
</template>

<script>
import dayjs from 'dayjs'
/* 引用 Vue */
import { computed, onMounted, reactive, ref } from 'vue'

/* 呼叫API */
import { apiGetSinglePosition, apiGetHistoryInspects } from "@/api/"

/* 引用路由 */
import { useRouter, useRoute } from 'vue-router'

// Component
import InspectChart from '@/components/JNC/InspectChart.vue'

import { inject } from 'vue'
export default {
  name: 'JNCDevice',
  components: {
    InspectChart,
  },

  setup(){
    /* 【Access Route inside setup】 */
    const router = useRouter()
    const route = useRoute()

    const swal = inject('$swal')

    
    /* 路由傳遞過來的 ID */
    const position_id = computed(()=> route.params.id)

    // 歷史資料讀取
    const hisotry_loading = ref(true)
   
    // 初始化
    onMounted( async ()=>{
      hisotry_loading.value = true
      await getSinglePosition() // 得到場域資料

      // 預設第一筆
      selected.value = [position.value['inspects'][0]['id']]
      await getHistoryInspects()
      
      swal("目前尚在開發階段", "查詢功能目前無功用", "warning")
    })


    const position = ref({}) // 該場域資料
    const loading = ref(false) // 載入動畫

    // 單一場域(含檢測項目列表)
    const getSinglePosition = async ()=>{
      try{
        const response = await apiGetSinglePosition(position_id.value)
        if(response.status === 200){
          const response_data = response['data']
          position.value = response_data
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

    /* 選單處理區 */
    const selected = ref([]) // 下拉選單選擇的內容


    /* 日期處理區 */
    const date_idx = ref([])
    const date_menu = ref(false)
    const date_text_field = ref("") // 顯示於輸入框
    const start_date = ref(null);
    const end_date = ref(null);

    // 允許點擊的日期(限今天(含)以前的日期)
    const allowedDates = (val) =>{
      const targetDate = dayjs(val); // 替换为您要计算的目标日期
      const today = dayjs();
      const diffInDays = today.diff(targetDate, 'day', true);
      return diffInDays >= 0 // 大於等於0才可以進行
    }


    // 儲存v-date-picker (@click:save)
    const saveDateIdx = ()=>{
      date_menu.value = false // 關閉 menu
    }
    // 清空v-date-picker (@click:cancel)
    const cancelDateIdx = ()=>{
      date_idx.value = null // 值清空
      date_text_field.value = ""
      start_date.value = null
      end_date.value = null
    }


    
    /* 修改v-date-picker (@update:modelValue) 【在save之後】 */
    const updateDateIdx = (range_date) =>{
      if(range_date.length > 0){
        const start = range_date[0] // 第一個
        const end = range_date.length === 2 ? range_date[1] : range_date[0] // 如果只給一個就給拿第一個
        start_date.value = dayjs(start).format("YYYY-MM-DD")
        end_date.value = dayjs(end).format("YYYY-MM-DD")
        date_text_field.value = `${start_date.value} ~ ${end_date.value}`
      }
    }


    const history_inspects = ref([])
    // 得到歷史資料
    const getHistoryInspects = async ()=>{
      hisotry_loading.value = true // 載入啟動
      try{
        const params = new URLSearchParams({
          inspect_id: JSON.stringify(selected.value) // 欲檢測數據ID
        })
        if(start_date.value && end_date.value){
          params.append('start_date', start_date.value)
          params.append('end_date', end_date.value)
        }
        const response = await apiGetHistoryInspects(params)
        if(response.status === 200){
          const response_data = response['data']
          const map_data = {}
          for(const data of response_data){
            const { inspect_name } = data
            if( !map_data.hasOwnProperty(inspect_name) ){
              map_data[inspect_name] = []
            }
            map_data[inspect_name].push(data)
          }

          history_inspects.value = map_data
        }
      }catch(err){
        console.log(err);
      }
      finally{
        hisotry_loading.value = false
      }
    }


    const search = async ()=>{
      await getHistoryInspects()
    }

    return {
      position_id, position, selected, 
      date_idx, date_menu, date_text_field, allowedDates, updateDateIdx, saveDateIdx, cancelDateIdx,
      history_inspects, hisotry_loading, search
    }
  },
};
</script>


<style scoped>


</style>