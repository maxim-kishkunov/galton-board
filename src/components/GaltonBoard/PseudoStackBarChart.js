
import React from 'react';
import ReactEcharts from 'echarts-for-react';
import {
    Col, Row
} from 'antd';
import moment from 'moment';

const idiot_date_format = 'MM.DD.YYYY';

export default class PseudoStackBarChart extends React.Component {
    constructor(props) {
        super(props);
        this.drawChart = this.drawChart.bind(this);
    }

    drawChart() {
        const {size, data} = this.props;
        let chartData = [];
        let ratio = 1;

        //Math.max(...r).toString().length - 1
        for(let i = 0; i <= size; i++){
            let columns = [];
            let barLength = data[i] * ratio;
            if(barLength > 9){
                // ratio = ratio / 10;
            }
            for(let j = 0; j < barLength; j++){
                columns.push(
                    <div className="bar-line-item"></div>
                )
            }
            chartData.push(
                <div className="bar-item">
                    {columns}
                </div>
            )
        }
        return chartData;
    }

    render() {
        let tableWidth = (this.props.size * 2 - 1) * 16;
        return (
            <div className="stack-bar-chart">
                {this.drawChart()}
            </div>
        );
    }
}