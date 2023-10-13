<template>
  <v-container>
    <v-btn @click="resetZoom" color="primary" variant="tonal">reset zoom</v-btn>
    
    <div style="width: 100%; min-height: 650px;" >
        <canvas id="chart_id"  ref="chart_ref" ></canvas>
    </div>
  </v-container>
</template>



<script>
/* 引用 Vue */
import { computed, onMounted, reactive, ref } from 'vue'

/* 引用 Chart.js */
import Chart from 'chart.js/auto';
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
        type: Array,
        default: () => []
    },
  },
  setup(props){
    // 讀取 props資料
    const _history = props.history_inspects
    // const _history = props.history_inspects.slice(0, 1)
    
    const chart_ref = ref(null) // ref DOM

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
                    borderWidth: 3,

                    /* 突出線 */
                    tickWidth: 3, 
                    tickColor: 'rgba(83, 92, 104, 0.7)',
                    tickLength: 20,

                    /* 圖表格線 */
                    lineWidth: 3,
                },

                
            },

            y: { // Y軸(餵食量(g))
                display: true,
                position: 'right',
                title: { 
                    display: true,
                    text: '酸鹼度',
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
            },
            
        } 
    })
    
    // xAxis
    const labels = computed(()=> {
        const times = _history.map( (item) => item['record_time'] )
        // const times = _history.map( (item) => item['created_at'] )
        return [...new Set(times)] // 不重複
    })

    // dataSet
    const datasets = computed(()=> {
        const datasets = []
        datasets.push({
            label: `酸鹼度`,
            type: 'line',
            order: 1,
            borderColor: 'rgba(255, 71, 87,1.0)',
            backgroundColor: 'rgba(255, 71, 87, 0.3)',
            fill: true,
            data: _history.map( (item) => ({
                x: item['record_time'],
                // x: item['created_at'],
                y: item['Value']
            })),
            tension: 0.3,
            pointHoverRadius: 10,
            yAxisID: 'y'
        } )
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

</style>