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
import ChartDataLabels from 'chartjs-plugin-datalabels'; // 資料標籤
import zoomPlugin from 'chartjs-plugin-zoom'; // Zoom: 放大/縮小

Chart.register(ChartDataLabels)
Chart.register(zoomPlugin)

import 'chartjs-adapter-date-fns'; // 引入時間處理
import {zhTW} from 'date-fns/locale'; // import date-fns locale:
import dayjs from 'dayjs';
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
            // Change options for ALL labels of THIS CHART(需要安裝 chartjs-plugin-datalabels)
            datalabels: { // 資料標籤
                display: 'auto',
                color: '#000',
                align: 'end',
                anchor: 'end',
                font:{ weight: 'bolder', },
                formatter: function(value, context) { // 回調函數
                    return value['y'] // 顯示Y值: {x: ..., y: ...}
                }
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
            x : { // X軸
                offset: true, // 當X軸內容超出容器時，可以校正回來
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
                        'hour': 'aa h:mm' // y: 年份； M: 月份 ； d: 天
                    }
                    // unit: 'day',
                    // displayFormats: {
                    //     'day': 'yyyy-MM-dd' // y: 年份； M: 月份 ； d: 天
                    // }
                },

                // 格線
                grid: { // 取消格線(圖表中)
                    display: false
                }, 
                
                // tick(跳動點)
                ticks: {
                    major: { // 有一個主要的群組(Day)
                        enabled: true,
                    },
                  
                    font: (context)=>{ // 字型樣式處理(透過 Func來去取得不一樣的結果)
                        if( !context.tick ) return undefined
                        const { major } = context['tick'] // 取出 tick資訊 (需要查找 major屬性是否為 true)

                        const majorStyle = {
                            size: '18px', // 字型大小
                            weight: 'bold', // 字體粗體
                        }
                        const generalStyle = {
                            size: '14px', // 字型大小
                        }
                        return major ? majorStyle : generalStyle
                    },

                    color: (context) => {  // 文字顏色處理(透過 Func來去取得不一樣的結果)
                        if( !context.tick ) return undefined
                        const { major } = context['tick'] // 取出 tick資訊 (需要查找 major屬性是否為 true)
                        return major ? 'blue' : 'grey'
                    },

                    callback: (value, index, ticks)=>{ // 用於顯示 tick的內容
                        const tick = ticks[index] // tick資訊(major、value)
                        return tick['major'] 
                                ? dayjs(tick['value']).format("M月D日")
                                : value; // callback帶入參數: value (原生label)
                    }
                },


            },
            y: { // Y軸(餵食量(g))
                display: true,
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
                }
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

    const backgroundColorRange = {
        id: 'backgroundColorRange',
        afterDatasetsDraw(chart, args, pluginOptions){
            const {
                ctx, 
                chartArea: {top, bottom, left, right, width, height},
                scales: {x, y}
            } = chart

            const ticks = x.getTicks()
            const majorTicks = ticks.filter((tick) => tick.major);
            
            ctx.save()

            
            for(let i = 0 ; i < majorTicks.length - 1; i++){
                const tick = majorTicks[i]
                const next_tick = majorTicks[i+1]
                const pixel = x.getPixelForValue( tick.value ) // 透過 value得到 pixel
                const next_pixel = x.getPixelForValue( next_tick.value ) // 透過 value得到 pixel
                if (i % 2 === 0){
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
                    // (x[pixel], y, width, height)
                    ctx.fillRect(pixel, top, next_pixel, height);
                }
            }
            ctx.restore();
        }
    }
   
    
    
    const CreateCharts = ()=>{ // 新增Chart
        const config = {
            type: 'line',
            data: chartData.value,
            options: options.value,
            plugins: [backgroundColorRange],
        }
        const ctx = chart_ref.value
        if( !Chart.getChart(ctx) ){ // 沒有圖表Instance再新增
            const chart = new Chart(ctx, config) // 新增Chart Instance
        }
    }

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