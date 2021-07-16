import React, { Component } from 'react';
import {
    Slider,
    Col,
    Button,
    InputNumber,
} from 'antd';
import BoardBlock from './BoardBlock'
import StackBarChart from './StackBarChart'

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            size: 1,
            allWays: [],
        };
        this.onChangeSlider = this.onChangeSlider.bind(this);
        this.handleStartTimer = this.handleStartTimer.bind(this);
        this.handleRestartTimer = this.handleRestartTimer.bind(this);
        this.handlePauseTimer = this.handlePauseTimer.bind(this);
    }

    onChangeSlider(fieldName,fieldValue){
        this.setState({
            allWays: [],
            isPaused: false,
            [fieldName]: fieldValue
        })
    }

    handleStartTimer() {
        let i = 0;
        this.timer = setInterval(() => {
            if(!this.state.isPaused) {
                let allWays = this.state.allWays;
                let size = this.state.size;
                allWays.forEach(function(currWay){
                    if(currWay.length <= size){
                        let randAddNumber = Math.round(Math.random(0))
                        let currWayLastItem = currWay[currWay.length - 1];
                        let currWayNewItem = {
                            row: currWayLastItem.row + 1,
                            cell: currWayLastItem.cell + randAddNumber,
                            parentCell: currWayLastItem.cell
                        };
                        currWayLastItem.childCell = currWayNewItem.cell;
                        currWay[currWay.length] = currWayNewItem;
                    }
                });
                if(i % 2 === 0)
                    allWays[allWays.length] = [{
                        row: 0,
                        cell: 0
                    }];
                this.setState({
                    allWays: allWays
                })
                i++;
            }
        }, 300);
    }

    handleRestartTimer() {
        this.setState({
            allWays: [],
            isPaused: false,
        },() => {
            clearInterval(this.timer);
            this.handleStartTimer();
        })
    }

    handlePauseTimer() {
        this.setState({
            isPaused: !this.state.isPaused
        })
    }

    render() {
        const {size, allWays} = this.state;
        let barChartData = Array(size + 1);
        for(let i = 0;i <= size;i ++){
            barChartData[i] = 0;
        }
        for(let i = 0; i <= allWays.length; i++){
            let currItem = allWays[i];
            if(currItem && currItem.length === size + 1){
                barChartData[currItem[currItem.length - 1].cell] ++;
            }
        }
        return (
            <div>
                <div className="control-wrap">
                    <label>Размер:</label>
                    <InputNumber name="size" value={this.state.size} onChange={(val) => this.onChangeSlider('size',val)} />
                    <Slider
                        min={1}
                        max={30}
                        onChange={(val) => this.onChangeSlider('size',val)}
                        defaultValue={this.state.size}
                    />
                    <div>
                        <Button disabled={this.timer} onClick={this.handleStartTimer}>Старт</Button>
                        <Button onClick={this.handlePauseTimer}>Пауза</Button>
                        <Button onClick={this.handleRestartTimer}>Рестарт</Button>
                    </div>
                </div>
                <div>
                    <Col span={12} style={{display:'flex',justifyContent: 'center', flexDirection: 'column'}}>
                        <BoardBlock {...this.props} size={this.state.size} allWays={this.state.allWays} />
                        <StackBarChart {...this.props} data={barChartData} size={this.state.size} /> 
                    </Col>
                </div>
            </div>
        );
        
    }
}
export default HomePage;