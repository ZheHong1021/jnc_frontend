<template>
  <v-container>
      <h6 class="text-h6 text-md-h5 font-weight-black">
        <v-icon icon="mdi-robot-vacuum" color="brown darken-2"></v-icon>
        <!-- 設備列表 ({{position_id}}) -->
        {{position['DeviceName']}} 
      </h6>
      <p class="text-subtitle-1 font-weight-black text-blue">
        檢測項目: {{ position['inspect_num']}}
      </p>

      <v-row class="my-4">
        <!-- #region 項目選項 -->
        <v-col cols="12" sm="6" md="5" lg="4" xl="3">
          <v-select
            v-model="selected"
            label="選擇檢測項目"
            :items="position['inspects']"
            item-title="TagName"
            item-value="TagName"
            multiple
            variant="solo-filled"
            prepend-inner-icon="mdi-fan-auto">
            <!-- Selection Display -->
            <template v-slot:selection="{ item, index }">
                <div :class="is_mobile ? 'mt-1' : 'mt-2'">
                    <v-chip v-if="index < 3" color="primary" class="font-weight-black">
                        <!-- item-title -->
                        {{ item['title'] }}
                    </v-chip>
                    <span v-if="index === 3" >
                        (+{{ selected.length - 3 }} others)
                    </span>
                </div>
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

        <!-- #region 項目選項圖表內容 -->
        <v-col cols="12">
          <InspectChart 
            v-if="!hisotry_loading"
            :history_inspects="history_inspects"
          />

          <v-skeleton-loader
            v-else
            class="mx-auto border"
            type="image@4"
          ></v-skeleton-loader>
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
      await getSinglePosition()
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
    }

    /* 修改v-date-picker (@update:modelValue) 【在save之後】 */
    const updateDateIdx = (range_date) =>{
      console.log(range_date);
      if(range_date.length > 0){
        let start_date = range_date[0]
        let end_date = range_date.length === 2 ? range_date[1] : range_date[0]
        start_date = dayjs(start_date).format("YYYY-MM-DD")
        end_date = dayjs(end_date).format("YYYY-MM-DD")
        date_text_field.value = `${start_date} ~ ${end_date}`

        getHistoryInspects(start_date, end_date)
      }
    }


    const history_inspects = ref([])
    // 得到歷史資料
    const getHistoryInspects = async (start_date=null, end_date=null)=>{
      try{
        const params = new URLSearchParams({
          inspect_id: 2 // 欲檢測數據ID
        })
        if(start_date && end_date){
          params.append('start_date', start_date)
          params.append('end_date', end_date)
        }
        const response = await apiGetHistoryInspects(params)
        if(response.status === 200){
          const response_data = response['data']
          history_inspects.value = response_data
        }
      }catch(err){
        console.log(err);
      }
      finally{
        hisotry_loading.value = false
      }
      
    }

    return {
      position_id, position, selected, 
      date_idx, date_menu, date_text_field, allowedDates, updateDateIdx, saveDateIdx, cancelDateIdx,
      history_inspects, hisotry_loading,
    }
  },
};
</script>


<style scoped>


</style>