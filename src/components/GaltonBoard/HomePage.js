import React, { Component } from 'react';
import {
    Slider,
    Col,
    Button
} from 'antd';
import BoardBlock from './BoardBlock'

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            size: 1,
            allWays: Array(),
        };
        this.onChangeSlider = this.onChangeSlider.bind(this);
        this.handleStartTimer = this.handleStartTimer.bind(this);
        this.handleRestartTimer = this.handleRestartTimer.bind(this);
        this.handleStopTimer = this.handleStopTimer.bind(this);
    }

    onChangeSlider(fieldName,fieldValue){
        this.setState({
            [fieldName]: fieldValue
        })
    }

    handleStartTimer() {
        this.timer = setInterval(() => {
            let allWays = this.state.allWays;
            let size = this.state.size;
            allWays.forEach(function(currWay){
                if(currWay.length <= size){
                    let randAddNumber = Math.round(Math.random(0))
                    let currWayLastItem = currWay[currWay.length - 1];
                    currWay[currWay.length] = {
                        row: currWayLastItem.row + 1,
                        cell: currWayLastItem.cell + randAddNumber
                    };
                }
            });
            allWays[allWays.length] = [{
                row: 0,
                cell: 0
            }];
            this.setState({
                allWays: allWays
            })
        }, 1000);
    }

    handleRestartTimer() {
        this.setState({
            allWays: []
        },() => {
            this.handleStartTimer();
        })
    }

    handleStopTimer() {
        clearInterval(this.timer);
    }

    render() {
        return (
            <div>
                <div className="control-wrap">
                    <label>Размер:</label>
                    <Slider
                        min={1}
                        max={30}
                        onChange={(val) => this.onChangeSlider('size',val)}
                        defaultValue={this.state.size}
                    />
                    <div>
                        <Button onClick={this.handleStartTimer}>Старт</Button>
                        <Button onClick={this.handleStopTimer}>Стоп</Button>
                        <Button onClick={this.handleRestartTimer}>Рестарт</Button>
                    </div>
                </div>
                <div>
                    <Col span={12} style={{display:'flex',justifyContent: 'center'}}>
                        <BoardBlock {...this.props} size={this.state.size} allWays={this.state.allWays} />
                    </Col>
                </div>
            </div>
        );
        
    }
}
export default HomePage;