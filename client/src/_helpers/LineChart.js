import React, { Component } from 'react'
import { 
    Modal,
} from 'antd';

class LineChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isPointDrawed: false,
            storedSize: 0,
            lastShownRoute: 0,
            shownRoutes: [],
            firstRedStep: -1,
            shownPiecesBlack: [],
            reset_canvas: 0,
        }
        this.canvasRef = React.createRef();

        this.drawChart = this.drawChart.bind(this);
        this.updateCanvas = this.updateCanvas.bind(this);
    }

    componentDidMount() {    
        this.updateCanvas();
    }

    componentDidUpdate(prevProps) {
        if(prevProps.chart_data !== this.props.chart_data || prevProps.reset_canvas !== this.props.reset_canvas )
            this.updateCanvas();
    }

    drawChart(){
        const {
            chart_data,
            bar_width,
            bar_height
        } = this.props;
        
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');
        let maxInData = 1;
        let minInData = 1;
        let middleLine = chart_data.reduce((a, b) => (a + b)) / chart_data.length;
        if(chart_data){
            Object.keys(chart_data).forEach(function(key){
              let val = chart_data[key];
              if(val > maxInData)
                maxInData = val;
              if(val < minInData)
                minInData = val;
            });
        }
        ctx.canvas.width  = bar_width * (chart_data.length + 2);
        ctx.canvas.height = (maxInData - minInData + 2) * bar_height;

        //	Axis
        for(let i = -8; i <= 8; i ++ )
        {
            if(i % 2 === 0){
                ctx.beginPath();
                if(i === 0){
                    ctx.strokeStyle = '#000';
                    ctx.lineWidth = 2;
                }else{
                    ctx.strokeStyle = '#acacac';
                    ctx.lineWidth = 1;
                }
                let yVal = (-1) * i * bar_height + maxInData * bar_height + bar_height;;
                ctx.moveTo(7, yVal);
                ctx.lineTo(bar_width * (chart_data.length + 1), yVal);
                ctx.stroke();
                ctx.closePath();
                ctx.fillStyle = '#000000';
                ctx.font = "8px Arial";
                ctx.fillText(i,0,yVal+3); //index of the bar
            }
        }
        //  /Axis

        ctx.beginPath();        
        ctx.strokeStyle = '#f5a700';
        ctx.moveTo(7, (-1) * middleLine * bar_height + maxInData * bar_height + bar_height);
        ctx.lineTo(bar_width + bar_width * (chart_data.length), (-1) * middleLine * bar_height + maxInData * bar_height + bar_height); 
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(7, 0);
        ctx.strokeStyle = '#4472c4';
        for(let i = 0; i < chart_data.length; i++){
            ctx.lineTo(bar_width + bar_width * (i + 1), (-1) * chart_data[i] * bar_height + maxInData * bar_height + bar_height); 
        }
        ctx.stroke();
        
        this.setState({
            chart_data: chart_data
        })
    }
      
    updateCanvas(){
        const { chart_data, reset_canvas} = this.props;

        if(!this.state.chart_data || this.state.chart_data !== chart_data || reset_canvas !== this.state.reset_canvas){
            this.drawChart();
        }
        this.setState({reset_canvas: reset_canvas});
    }

    render() {
        return (
            <canvas ref={this.canvasRef} {...this.props} onClick={()=>{
                return(
                    Modal.info({
                        title: 'Ошибка!',
                        content: <div classame="chart-modal"></div>,
                    })
                );
            }}/>
        );
    }    
}

export default LineChart