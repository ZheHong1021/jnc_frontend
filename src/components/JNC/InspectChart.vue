<template>

  <v-container>
    <v-btn @click="resetZoom" color="primary" variant="tonal">reset zoom</v-btn>
    
    <div class="chart-container my-4">
        <canvas id="chart_id"  ref="chart_ref" ></canvas>
    </div>
  </v-container>
</template>



<script>
/* 引用 Vue */
import { computed, onMounted, reactive, ref, watch } from 'vue'

/* 引用 Chart.js */
import Chart from 'chart.js/auto';
import { color as ChartColor } from 'chart.js/helpers';

// import ChartDataLabels from 'chartjs-plugin-datalabels'; // 資料標籤
import zoomPlugin from 'chartjs-plugin-zoom'; // Zoom: 放大/縮小
// Chart.register(ChartDataLabels)
Chart.register(zoomPlugin)

import 'chartjs-adapter-date-fns'; // 引入時間處理
import {zhTW} from 'date-fns/locale'; // import date-fns locale:

// 自定義好用套裝工具
import {staticLabelUtil, hoverLabelUtil, hoverVerticalLineUtil} from '@/utility/Utils.js'

export default {
  name: 'InspectChart',
  props: {
    history_inspects: {
        type: Object,
        default: () => ({})
    },
  },


  setup(props){
    // 讀取 props資料
    // const props.history_inspects = props.history_inspects
    
    const chart_ref = ref(null) // ref DOM

    watch(() => props.history_inspects, 
        (newVal, oldVal)=>{
            UpdateCharts()
        },
        { deep: true } // 深度
    )

    // 圖表設定
    const chartOptions = ref({
        bezierCurve: false,
        responsive: true,
        maintainAspectRatio: false, // 維持尺寸
        interaction: { // Group Tooltip
            /* 交互Hover(不用弄到小Point中) */
            mode: 'nearest',
            axis: 'x',
            intersect: false,
        },
        plugins: { // Plugins
            title: { // 主標題
                display: true,
                text: '',
                font: { weight: "bolder", size: 18,},
            },
            subtitle: { // 副標題
                display: true,
                text: '',
                color: '#ED4C67',
                font: { weight: "bolder", size: 16, },
            },
            
            tooltip:{ // 提示框
                padding: 10,
                titleFont: {
                    size: 16,
                    weight: 'bolder',
                },
                titleMarginBottom: 10, // title margin-bottom
                bodyFont: {
                    size: 14,
                },  
                bodySpacing: 10, // body間距
                backgroundColor: 'rgba(247, 245, 248, 0.8)',
                titleColor: 'black',
                bodyColor: 'black',
                borderColor: 'blue',
                borderWidth: '1',
                callbacks: {
                    title: (context)=> { // toolTip Title: 存放日期
                        const Labelx = context[0]['raw']['x']
                        return '時間: ' + new Date(Labelx).toLocaleString() // 透過 toLocaleString: 轉換成台灣時間
                    },
                },
            },
            zoom: { // 『chartjs-plugin-zoom』套件引用
                limits: { // 限制原本Zoom為上下限
                    x: {min: 'original', max: 'original'}
                },
                zoom: { // 縮放功能
                    wheel: {
                        enabled: true,
                    },
                    pinch: {
                        enabled: true
                    },
                    mode: 'x',
                },
                pan: { // 平移功能
                    enabled: true,
                    mode: 'x',
                },
            },
        },

        scales:{ // Scales
            x: { // X軸 (小時)
                title: {
                    display: true,
                    text: '時間',
                    font: {
                        size: '14px',
                        weight: 'bolder'
                    },
                },
                adapters: { // date-fns locale
                    date: {
                        locale: zhTW
                    }
                },

                type: 'time',
                time: {
                    unit: 'hour',
                    displayFormats: {
                        // 'hour': 'aa hh:mm' // y: 年份； M: 月份 ； d: 天
                        'hour': 'HH:mm' // y: 年份； M: 月份 ； d: 天
                        // 'hour': 'aa H 時' // y: 年份； M: 月份 ； d: 天
                    }
                },
                // 格線
                grid: { // 取消格線(圖表中)
                    display: false
                }, 
                ticks: {
                    font: { size: '14px'},
                    color: 'grey',
                }
            },

            x2: { // X軸 (日期)
                position: 'top',
                type: 'time',
                time: {
                    unit: 'day',
                    displayFormats: {
                        'day': 'yyyy-MM-dd' // y: 年份； M: 月份 ； d: 天
                    }
                },
                ticks: {
                    font: {
                        size: '20px',
                        weight: 'bold',
                    },
                    color: 'rgba(83, 82, 237,1.0)',
                },

                // 格線
                grid: { // 取消格線(圖表中)
                    /* 邊框線 */
                    borderColor: 'rgba(83, 92, 104, 0.7)',
                    borderWidth: 1,

                    /* 突出線 */
                    tickWidth: 1, 
                    tickColor: 'rgba(83, 92, 104, 0.7)',
                    tickLength: 20,

                    /* 圖表格線 */
                    lineWidth: 3,
                },

                
            },
            
        } 
    })
    
    // xAxis
    const labels = computed(()=> {
        let acc_times = []
        for(const key in props.history_inspects){
            const times = props.history_inspects[key].map( (item) => item['record_time'] )
            acc_times = [...acc_times,  ...times]
        }
        return [...new Set(acc_times)] // 不重複
       
    })

    const darkColors = [
        'rgba(55, 66, 250,1.0)',
        'rgba(255, 71, 87,1.0)',
        'rgba(46, 213, 115,1.0)',
        'rgba(255, 127, 80,1.0)',
        'rgba(243, 104, 224,1.0)',
    ]
    const lightColors = [
        'rgba(55, 66, 250,0.3)',
        'rgba(255, 71, 87,0.3)',
        'rgba(46, 213, 115,0.3)',
        'rgba(255, 127, 80,0.3)',
        'rgba(243, 104, 224,0.3)',
    ]

    // dataSet
    const datasets = computed(()=> {
        const datasets = []
        let i = 0
        for( const key in props.history_inspects ){
            datasets.push({
                label: key,
                type: 'line',
                order: 1,
                fill: true,
                backgroundColor: lightColors[i],
                borderColor: darkColors[i],
                data: props.history_inspects[key].map( (item) => ({
                    x: item['record_time'],
                    y: item['Value']
                })),
                tension: 0.3,
                pointHoverRadius: 10,
                yAxisID: `y_${key}`
            } )

            i += 1 // 紀錄 index
        }
        return datasets
    })

    const chartData = computed(()=>{
        return {
            labels: labels.value,
            datasets: datasets.value,
        }
    })

    // Final Config
    const options= computed(()=>{ // 最終圖表設定，將以上所有得到資料匯入到圖表
        let options = Object.assign( chartOptions.value, {} )
        options.plugins.title.text = `2801` // 圖表標題
        options.plugins.subtitle.text = '酸鹼度'


        /* Y Scale */
        for(const key in props.history_inspects){
            const value = props.history_inspects[key].map( item => item['Value'] )
            const max_value = Math.max( ...value ) // 最大值
            const min_value = Math.min( ...value ) // 最小值

            options.scales[`y_${key}`] =  { // Y軸(餵食量(g))
                display: false,
                position: 'right',
                title: { 
                    display: true,
                    text: key,
                    font: {
                        size: 18, // 字型大小
                        weight: 'bold', // 字體粗體
                    },
                },
                ticks:{
                    color: 'grey',
                    font: {
                        size: '14px', // 字型大小
                    },
                },
                
                max: max_value === 0 ? 1 : max_value,
                min: min_value === 0 ? -1 : min_value

            }
        }

        return options
    })

    const CreateCharts = ()=>{ // 新增Chart
        const config = {
            type: 'line',
            data: chartData.value,
            options: options.value,
            plugins: [
                // staticLabelUtil,
                // hoverLabelUtil,
                hoverVerticalLineUtil,
            ]
        }
        const ctx = chart_ref.value
        if( !Chart.getChart(ctx) ){ // 沒有圖表Instance再新增
            const chart = new Chart(ctx, config) // 新增Chart Instance
        }
    }


    const UpdateCharts = () => { // 更新圖表(config、data)
        const canvas = chart_ref.value
        const chart = Chart.getChart(canvas)
        if( chart ){ // 如果有圖表則更新
            chart.config.data = chartData.value
            chart.config.options = options.value
            chart.update()
        }
    }
    
    

    // 回到最一開始的圖表範圍
    const resetZoom = ()=>{
        const chart = Chart.getChart(chart_ref.value)
        if(chart){
            chart.resetZoom();
        }
    }
    
    /* LifeCycle */
    onMounted( async()=>{
        CreateCharts()
    })

    return {
        labels, datasets, chartData, options,
        chart_ref, resetZoom
    }
  },
};
</script>

<style scoped>
    .chart-container{
        width: 100%; 
        min-height: 650px;
        background-color: rgba(200, 214, 229, 0.1);
        border: 5px solid rgba(87, 101, 116, 1.0);
        border-radius: 20px;
        padding: 0.5rem;
    }
</style>