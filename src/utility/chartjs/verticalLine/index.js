export const hoverVerticalLine = {
    id: 'hoverVerticalLine',
    afterDatasetsDraw(chart, args, plugins){
        const {
            ctx, tooltip,
            chartArea: {top, bottom, left, right, width, height},
            scales: {x, y}
        } = chart;

        if( tooltip._active.length > 0 ){
            const { dataPoints } = tooltip
            // const xCoor = dataPoints[0]['dataIndex']
            // const xCoor = dataPoints[0]['dataIndex']
            const xCoor = x.getPixelForValue(dataPoints[0]['parsed']['x'])
            // const yCoor = y.getPixelForValue(dataPoints[0]['parsed']['y'])

            ctx.save()
            ctx.beginPath()
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'rgba(87, 101, 116, 0.8)'
            ctx.setLineDash([6, 6])
            ctx.moveTo(xCoor, top)
            ctx.lineTo(xCoor, bottom)
            ctx.stroke()
            ctx.closePath()
            ctx.setLineDash([])
            
        }

    }
}