import React, { Component } from 'react';
import { 
    Modal,
} from 'antd';
import StackBarChartChild from './StackBarChart';

class StackBarChart extends Component {
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

        this.drawStackBarChart = this.drawStackBarChart.bind(this);
        this.updateCanvas = this.updateCanvas.bind(this);
    }

    componentDidMount() {    
        this.updateCanvas();
    }

    componentDidUpdate(prevProps) {
        if(prevProps.chart_data !== this.props.chart_data || prevProps.reset_canvas !== this.props.reset_canvas )
            this.updateCanvas();
    }

    drawStackBarChart(){
        const {
            size,
            chart_data,
            bar_width,
            bar_height,
            curr_step
        } = this.props;
        
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');

        let maxInData = 1;
        if(chart_data){
            Object.keys(chart_data).forEach(function(key){
                let val = chart_data[key];
                if(val > maxInData)
                    maxInData = val;
            });
        }
        ctx.canvas.width  = (bar_width - 2) * ((size * 2) + 1);
        ctx.canvas.height = maxInData * bar_height + 28;
    
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        ctx.beginPath();

        let k = 0;
        for(let i = Math.floor(-1 * size); i <= size; i++){
            let startX = k * (bar_width);
            let barLength = chart_data[i] ? chart_data[i] : 0;
            let startY = maxInData * bar_height + 14 - bar_height * barLength;//16 * size + 168;
            
            ctx.fillStyle = '#acacac';
            if(i >= -1 && i <= 1)
                ctx.fillStyle='#070';
            if(curr_step && curr_step === i - 1){
                ctx.rect(startX,startY,bar_width, bar_height);
                ctx.fill();
                ctx.lineWidth = 1;
                ctx.strokeStyle = "black";             
            }
                
            ctx.fillRect(startX,startY,bar_width, barLength * bar_height);   

            ctx.fillStyle = '#000000';
            ctx.fillText(chart_data[i] ? chart_data[i] : '',startX + (bar_width / 2 - 4),startY - 1); //value of the bar
            ctx.fillRect(startX,startY + barLength * bar_height,bar_width, 1); // axis
            if(i >= -1 && i <= 1){
                ctx.beginPath();
                ctx.rect(startX,startY + barLength * bar_height,bar_width, 14);
                ctx.lineWidth = 1;
                ctx.strokeStyle = "black";                
                ctx.stroke();
                
                if(i === -1){
                    ctx.beginPath();
                    ctx.fillStyle = 'rgba(255,255,255,1)';
                    ctx.fillRect(startX + bar_width - 2,startY + barLength * bar_height + 1,2, 12);
                }else{
                    ctx.beginPath();
                    ctx.fillStyle = "#fff";
                    ctx.fillRect(startX - 1,startY + barLength * bar_height + 1,2, 12);
                }
            }
            ctx.fillStyle = '#000000';
            ctx.fillText(i,startX + (bar_width / 2 - 4),startY + barLength * bar_height + 12); //index of the bar
            ctx.stroke();
            k++;
        }
        this.setState({
            chart_data: chart_data
        })
    }
      
    updateCanvas(){
        const { chart_data, reset_canvas} = this.props;

        if(!this.state.chart_data || this.state.chart_data !== chart_data || reset_canvas !== this.state.reset_canvas){
            this.drawStackBarChart();
        }
        this.setState({reset_canvas: reset_canvas});
    }

    render() {
        return (
            <canvas ref={this.canvasRef} {...this.props} onClick={()=>{
                if(!this.props.is_child)
                    return(
                        Modal.info({
                            className: "chart-modal",
                            width: 35 * this.props.size * 2 + 40,
                            content: <div>
                                <StackBarChartChild  
                                    {...this.props}
                                    is_child={true}
                                    bar_height={20}
                                    bar_width={35}
                                />
                            </div>,
                        })
                    );
                else
                    return '';
            }}/>
        );
    }    
}

export default StackBarChart