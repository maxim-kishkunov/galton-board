
import React from 'react';
import ReactEcharts from 'echarts-for-react';
import {
    Col, Row
} from 'antd';
import moment from 'moment';

const idiot_date_format = 'MM.DD.YYYY';

export default class StackBarChart extends React.Component {
    constructor(props) {
        super(props);
        this.getOption = this.getOption.bind(this);
    }

    getOption = () => {
        let tableWidth = (this.props.size * 2 - 1) * 16;
        let categories = [];
        for(let i = 1;i <= this.props.size + 1; i++)
            categories.push(i);
        return {
            grid: {
                // left: '-10px',
                // right: '0',
                // bottom: '0',
                top: '10px',
                width: {tableWidth} + 'px',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: categories
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: this.props.data,
                type: 'bar',
                // barWidth: 15,
            }]
        };
    };

    render() {
        let tableWidth = (this.props.size * 2 - 1) * 16;
        return (
                <ReactEcharts
                    style={{
                        width: '300px',
                        height: '200px',
                        margin: '0 auto',
                    }}
                    option={this.getOption()}
                    notMerge={true}
                    lazyUpdate={true}
                    className='react_for_echarts'
                    onChartReady ={this.onChartReady}/>

        );
    }
}
 //export default ProgressBar;