import dayjs from "dayjs";
/* 綁定在 y軸旁邊 hover時觸發的 text區塊 */
export const staticLabel = {
    id: 'staticLabel',
    beforeDatasetsDraw(chart, args, plugins){
         const {
            ctx, data,
            chartArea: {top, bottom, left, right, width, height},
            scales: {x, y}
        } = chart

        ctx.save();

        const _data = data.datasets[0].data
        const lastPoint = _data.length - 1

        // static line
        ctx.beginPath()
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'black'; // 線條顏色
        ctx.setLineDash([6, 6]); // 線條間隔(要用到的)
        ctx.moveTo(left, y.getPixelForValue(_data[lastPoint].y))
        ctx.lineTo(right, y.getPixelForValue(_data[lastPoint].y))
        ctx.stroke();
        ctx.setLineDash([]); // 線條間隔(避免修改已存在)
        ctx.restore();

        // static bubble
        ctx.beginPath()
        ctx.fillStyle = 'rgba(47, 53, 66,1.0)'
        const rectWidth = ctx.measureText(_data[lastPoint].y).width + 10 // 正方形寬度(得到文字的寬度 (+10: padding))
        const rectHeight = 20 // 正方形高度
        ctx.roundRect(
            right,
            y.getPixelForValue(_data[lastPoint].y) - 10,
            rectWidth,
            rectHeight,
        )
        ctx.fill()

        // static text
        ctx.font = 'bold 12px sans-serif'
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center'
        ctx.fillText(
            _data[lastPoint].y, 
            right + (rectWidth / 2), // 寬度/2: 為了置中
            y.getPixelForValue(_data[lastPoint].y)
        )
    }
}

let xHoverCoor;
let yHoverCoor;
let hoverIndex;
export const hoverLabel ={
    id: 'hoverLabel',
    beforeDatasetsDraw(chart, args, plugins){
        const {
           ctx, canvas,
           chartArea: {top, bottom, left, right, width, height},
           scales: {x, y}
       } = chart
    
        if( xHoverCoor && yHoverCoor ){
            const nearestX = x.getValueForPixel(xHoverCoor)
            const nearestXDate = new Date(nearestX)
            ctx.save();
            ctx.beginPath()
            ctx.fillStyle = 'rgba(255, 26, 104, 0.2)'
            ctx.fillRect(
                x.getPixelForValue(nearestXDate), 
                top, 
                10, 
                height
            )

            ctx.restore();
       }
    },

    afterDatasetsDraw(chart, args, plugins){
        const {
            ctx, data,
            chartArea: {top, bottom, left, right, width, height},
            scales: {x, y}
        } = chart

        if( xHoverCoor && yHoverCoor ){
                ctx.save();
                
                const nearestX = x.getValueForPixel(xHoverCoor)
                const nearestXDate = new Date(nearestX)
                const yyyymmdd = dayjs(nearestXDate).format('hh:mm')
        
        
                // cloud
                // 文字寬度 (+20: padding)
                const textWidth = ctx.measureText('100').width + 20
        
                ctx.beginPath()
                ctx.fillStyle = 'rgba(255, 26, 104, 1)'
                ctx.roundRect( 
                    x.getPixelForValue(nearestXDate) - (textWidth / 2), 
                    bottom,
                    textWidth,
                    20, 
                    4 
                )
                ctx.fill()
        
                // text
                ctx.font = 'bold 12px sans-serif'
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center'
                ctx.fillText(
                    yyyymmdd, 
                    x.getPixelForValue(nearestXDate),
                    bottom + 10 // padding
                )
        
        
                // hoverline
                const _data = data.datasets[0].data
                ctx.beginPath()
                ctx.strokeStyle = 'black'
                ctx.setLineDash([3, 3])
                ctx.moveTo(left, y.getPixelForValue(_data[hoverIndex].y))
                ctx.lineTo(right, y.getPixelForValue(_data[hoverIndex].y))
                ctx.stroke()
                ctx.setLineDash([])

                // hoverCloud
                // 文字寬度 (+20: padding)
                const hoverTextWidth = ctx.measureText(_data[hoverIndex].y).width + 10

                ctx.beginPath()
                ctx.fillStyle = 'black'
                ctx.roundRect(
                    right,
                    y.getPixelForValue(_data[hoverIndex].y) - 10,
                    hoverTextWidth,
                    20,
                    4
                )
                ctx.fill()
                

                // hovertext
                ctx.font = 'bold 12px sans-serif'
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center'
                ctx.fillText(
                    _data[hoverIndex].y, 
                    right + (hoverTextWidth / 2), // 寬度/2: 為了置中
                    y.getPixelForValue(_data[hoverIndex].y)
                )

        }

    },

    afterEvent(chart, args){
         const {
            ctx, canvas,
            chartArea: {top, bottom, left, right, width, height},
            scales: {x, y}
        } = chart
        
        if( args.inChartArea ){
            /* 滑動事件 */
            canvas.addEventListener( 'mousemove', (e)=>{
                nearestValue(chart, e)
            } )

            const nearestValue = (chart, mousemove)=>{
                const points = chart.getElementsAtEventForMode(mousemove, 'nearest', {intersect: false}, true)
                if( points.length ){
                    hoverIndex = points[0].index;
                }
            }
            xHoverCoor = args.event.x;
            yHoverCoor = args.event.y;
        }else{
            xHoverCoor = undefined;
            yHoverCoor = undefined;
            hoverIndex = undefined;
        }

        args.changed = true;
    }
}