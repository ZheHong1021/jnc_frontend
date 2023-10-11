<template>
  <v-container>
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
import ChartDataLabels from 'chartjs-plugin-datalabels';
import zoomPlugin from 'chartjs-plugin-zoom';
Chart.register(ChartDataLabels)
Chart.register(zoomPlugin)

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
    
    // #region(圖表設定)
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
                    title: (context)=> '時間: ' + context[0]['label'],
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
            },
            y: { // Y軸(餵食量(g))
                display: true,
                title: { 
                    display: true,
                    text: '酸鹼度',
                    font: {
                        size: 16,
                    },
                },
                beginAtZero: false,
            },
        } 
    })
    
    const labels = computed(()=> {
        const times = _history.map( (item) => item['record_time'] )
        return [...new Set(times)] // 不重複
    })

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

    const options= computed(()=>{ // 最終圖表設定，將以上所有得到資料匯入到圖表
        let options = Object.assign( chartOptions.value, {} )
        options.plugins.title.text = `2801` // 圖表標題
        options.plugins.subtitle.text = '酸鹼度'
        return options
    })
    // #endregion

    const chart_ref = ref(null) // ref DOM
    
    const CreateCharts = ()=>{ // 新增Chart
        const config = {
            type: 'line',
            data: chartData.value,
            options: options.value,
        }
        const ctx = chart_ref.value
        if( !Chart.getChart(ctx) ){ // 沒有圖表Instance再新增
            const chart = new Chart(ctx, config) // 新增Chart Instance
        }
    }

    onMounted( async()=>{
        CreateCharts()
    })

    return {
        labels, datasets, chartData, options,
        chart_ref
    }
  },
};
</script>

<style scoped>

</style>