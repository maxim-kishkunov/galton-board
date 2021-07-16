
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
        let categories = [];
        for(let i=0;i< this.props.size; i++)
            categories.push(i);
        return {
            xAxis: {
                type: 'category',
                data: categories
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: this.props.data,
                type: 'bar'
            }]
        };
    };

    render() {
        return (
                <ReactEcharts
                    style={{
                        height: window.innerWidth > 1024 ? '600px' : '300px',
                        width: '300px'
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