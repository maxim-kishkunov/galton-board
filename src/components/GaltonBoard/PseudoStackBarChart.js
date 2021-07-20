
import React from 'react';

export default class PseudoStackBarChart extends React.Component {
    constructor(props) {
        super(props);
        this.drawChart = this.drawChart.bind(this);
    }

    drawChart() {
        const {size, data} = this.props;
        let chartData = [];
        let ratio = 1;

        let maxDigitQuantity = Math.max(...data).toString().length - 1;
        for(let i = 0; i < maxDigitQuantity; i++){
            ratio = ratio / 10;
        }
        for(let i = 0; i <= size; i++){
            let columns = [];
            let barLength = data[i] * ratio;
            for(let j = 0; j < barLength; j++){
                columns.push(
                    <div key={`line-item${i}_${j}`} className="bar-line-item"></div>
                )
            }              
            chartData.push(
                <div key={`item_${i}`} className="bar-item">
                    {columns}
                    <div className="bar-item-quantity">
                        {data[i]}
                    </div>
                </div>
            )
        }
        return chartData;
    }

    render() {
        return (
            <div className="stack-bar-chart">
                <div className="chart-inner">
                    {this.drawChart()}
                </div>
            </div>
        );
    }
}