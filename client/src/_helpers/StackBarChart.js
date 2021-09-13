import React, { Component } from 'react'

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
        const {size, chart_data} = this.props;
        
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');

        ctx.canvas.width  = 50 * ((size * 2) + 1);
        ctx.canvas.height = 16 * (size + 2) + 150;
    
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        ctx.beginPath();

        let k = 0;
        for(let i = Math.floor(-1 * size); i <= size; i++){
            let startX = k * 50;
            let barLength = chart_data[i] ? chart_data[i] : 0;
            let startY = (16 * size) + 15 * (10 - barLength);//16 * size + 168;
                        
            ctx.fillStyle = '#acacac';
            if(i >= -1 && i <= 1)
                ctx.fillStyle='#070';
            ctx.fillRect(startX,startY,48, barLength * 15);

            ctx.fillStyle = '#000000';
            ctx.fillText(chart_data[i] ? chart_data[i] : '',startX + 10,startY - 1); //value of the bar
            ctx.fillRect(startX,startY + barLength * 15,48, 1);
            if(i >= -1 && i <= 1){
                ctx.fillStyle = '#acacac';
                ctx.fillRect(startX,startY + barLength * 15,48, 14);
            }
            ctx.fillStyle = '#000000';
            ctx.fillText(i,startX + 20,startY + barLength * 15 + 12); //index of the bar
            ctx.stroke();
            k++;
        }
        this.setState({
            chart_data: chart_data
        })
    }
      
    updateCanvas(){
        const {size, chart_data, reset_canvas} = this.props;

        if(!this.state.chart_data || this.state.chart_data !== chart_data || reset_canvas !== this.state.reset_canvas){
            this.drawStackBarChart();
        }
        this.setState({reset_canvas: reset_canvas});
    }

    render() {
        return (
            <canvas ref={this.canvasRef} {...this.props}/>
        );
    }    
}

export default StackBarChart