import React, { Component } from 'react';
import {
    Slider,
    Col,
    Button,
    InputNumber,
} from 'antd';
// import BoardBlock from './BoardBlock'
import BoardWithCanvas from './BoardWithCanvas'
import PseudoStackBarChart from './PseudoStackBarChart'

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            size: 1,
            allRoutes: [],
            firstRedStep: -1,
        };
        this.onChangeSlider = this.onChangeSlider.bind(this);
        this.handleStartTimer = this.handleStartTimer.bind(this);
        this.handleRestartTimer = this.handleRestartTimer.bind(this);
        this.handlePauseTimer = this.handlePauseTimer.bind(this);
        this.setFirstRedStep = this.setFirstRedStep.bind(this);
    }

    onChangeSlider(fieldName,fieldValue){
        this.setState({
            allRoutes: [],
            isPaused: false,
            [fieldName]: fieldValue
        })
    }

    handleStartTimer() {
        let i = 0;
        this.timer = setInterval(() => {
            if(!this.state.isPaused) {
                let allRoutes = this.state.allRoutes;
                let size = this.state.size;
                for(let j = 0; j < allRoutes.length; j ++){
                    if(allRoutes[j].length <= size){
                        let randAddNumber = Math.round(Math.random(0));
                        allRoutes[j].push(allRoutes[j][allRoutes[j].length - 1] + randAddNumber);
                    }
                }
                if(i % 2 === 0){
                    allRoutes.push([0]);
                }
                this.setState({
                    allRoutes: allRoutes
                })
                i++;
            }
        }, 30);
    }

    handleRestartTimer() {
        this.setState({
            allRoutes: [],
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

    setFirstRedStep(firstRedStep) {
        this.setState({
            firstRedStep: firstRedStep
        })
    }

    render() {
        const {size, allRoutes} = this.state;
        let barChartData = Array(size + 1);
        for(let i = 0;i <= size;i ++){
            barChartData[i] = 0;
        }
        for(let i = 0; i <= allRoutes.length; i++){
            let currItem = allRoutes[i];
            if(currItem && currItem.length === size + 1){
                barChartData[+ currItem[currItem.length - 1]] ++;
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
                    <div>
                        Всего бросков: {this.state.allRoutes.length}
                    </div>
                    {
                        this.state.firstRedStep !== -1 ? 
                            <div>
                                Первый повторившийся путь: {this.state.firstRedStep}
                            </div>
                        :('')
                    }
                </div>
                <div>
                    <Col span={12} style={{display:'flex',justifyContent: 'center', flexDirection: 'column'}}>
                        {/* <BoardBlock {...this.props} size={this.state.size} allRoutes={this.state.allRoutes} /> */}
                        <BoardWithCanvas 
                            {...this.props} 
                            size={this.state.size} 
                            all_routes={this.state.allRoutes} 
                            bar_chart_data={barChartData} 
                            routes_length={this.state.allRoutes.length}
                            setFirstRedStep={this.setFirstRedStep}  />

                        {/* <PseudoStackBarChart
                            {...this.props} 
                            size={this.state.size} 
                            all_routes={this.state.allRoutes} 
                            data={barChartData} 
                            routes_length={this.state.allRoutes.length}
                            setFirstRedStep={this.setFirstRedStep}  /> */}
                    </Col>
                </div>
            </div>
        );
        
    }
}
export default HomePage;