import axios from 'axios';
import React, { Component } from 'react';
import { 
    Modal,
 } from 'antd';
import {
    Slider,
    Col,
    Button,
    InputNumber,
    Divider,
    Radio,
} from 'antd';

import BoardWithCanvas from './BoardWithCanvas';
import SampleSpaces from './SampleSpaces';

let timer = false;
let globalFirstRedStep = -1;
class GBHomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            size: 1,
            allRoutes: [],
            firstRedStep: -1,
            reset_canvas: 0,
            resultShowMode: 'sorted_groups',
            repeates: [],
            pesDataUnsorted:[],
        };
        this.onChangeSlider = this.onChangeSlider.bind(this);
        this.handleStopTimer = this.handleStopTimer.bind(this);
        this.handleStartTimer = this.handleStartTimer.bind(this);
        this.handleRestartTimer = this.handleRestartTimer.bind(this);
        this.handlePauseTimer = this.handlePauseTimer.bind(this);
        this.setFirstRedStep = this.setFirstRedStep.bind(this);
        this.handleDropSome = this.handleDropSome.bind(this);
        this.getBoardPES = this.getBoardPES.bind(this);
        this.onSwitchResultShowMode = this.onSwitchResultShowMode.bind(this);
        this.resetBoard = this.resetBoard.bind(this);
        this.setRepeates = this.setRepeates.bind(this);
    }

    componentDidMount(){
        this.getBoardPES();
    }

    onChangeSlider(fieldName,fieldValue){
        this.setState({
            allRoutes: [],
            isPaused: false,
            isStarted: false,
            reset_canvas: + this.state.reset_canvas + 0.00001,
            [fieldName]: fieldValue,            
            pesData: [],
            pesDataFormatted: [],
            firstRedStep: -1,
        },() => {
            this.getBoardPES();
        })
    }

    handleStartTimer() {
        let i = 0;
        this.setState({
            allRoutes: [],
            firstRedStep: -1,
            reset_canvas: + this.state.reset_canvas + 0.00001
        },()=>{
            globalFirstRedStep = -1;
            timer = setInterval(() => {
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
                        isStarted: true,
                        allRoutes: allRoutes
                    })
                    i++;
                }
            }, 30);
        });
    }

    handleDropSome(quantity) {
        let allRoutes = [];
        this.setState({
            allRoutes: allRoutes,
            firstRedStep: -1,
            reset_canvas: + this.state.reset_canvas + 0.00001
        });

        for(let i = 0; i < quantity; i ++){
            let routeItem = [0];
            for(let j = 1; j <= this.state.size; j ++){
                let randAddNumber = Math.round(Math.random(0));
                routeItem.push(routeItem[routeItem.length - 1] + randAddNumber);
            }
            allRoutes.push(routeItem);
        }
        this.setState({
            allRoutes: allRoutes,
            firstRedStep: -1,
            repeates:[],
            reset_canvas: + this.state.reset_canvas + 0.00001
        });
        globalFirstRedStep = -1;
    }

    handleRestartTimer() {
        this.setState({
            allRoutes: [],
            isPaused: false,
            firstRedStep: -1,
            repeates:[],
            reset_canvas: + this.state.reset_canvas + 0.00001
        },() => {
            clearInterval(timer);
            timer = false;
            this.handleStartTimer();
        })
    }

    handleStopTimer() {
        this.setState({
            allRoutes: [],
            isPaused: false,
            isStarted: false,
            firstRedStep: -1,
            repeates:[],
            reset_canvas: + this.state.reset_canvas + 0.00001
        },() => {
            clearInterval(timer);
            this.timer = false;
        })
    }

    handlePauseTimer() {
        this.setState({
            isPaused: !this.state.isPaused
        })
    }

    setFirstRedStep(firstRedStep) {
        if(globalFirstRedStep === -1){
            globalFirstRedStep = firstRedStep
            this.setState({
                firstRedStep: firstRedStep
            })
        }
    }

    resetBoard(){
        globalFirstRedStep = -1;
        this.setState({
            allRoutes: [],
            repeates:[],
            isPaused: false,
            isStarted: false,
            firstRedStep: -1,
            reset_canvas: + this.state.reset_canvas + 0.00001
        });
    }
    
    getBoardPES() {
        const { 
            size
        } = this.state;
        axios.get(`/get_sample_space`,{params: 
            {
                size: size,
            }}
        ).then(response => {
            if(response.data.code !== 200){
                Modal.error({
                    title: 'Error!',
                    content: response.data.message,
                });
            }else{
                this.setState({
                    pesData: JSON.parse(response.data.data.spaces_json),
                    pesDataUnsorted: JSON.parse(response.data.data.unsorted_data),
                    pesDataFormatted: JSON.parse(response.data.data.formatted_spaces_json)
                })
            }
        })
        
    }

    onSwitchResultShowMode(ev){
        this.setState({
            resultShowMode: ev.target.value
        });
    };

    setRepeates(repArr){
        this.setState({
            repeates:repArr
        })
    }
    render() {
        const {allRoutes} = this.state;

        let lastPoints = allRoutes.map((item, index, array) => {
            return(
                item[item.length - 1]
            )
        });

        return (
            <div className="galton-board-wrap">
                <Col span={12} className="control-wrap">
                    <label>Размер:</label>
                    <InputNumber max={15} min={1} name="size" value={this.state.size} onChange={(val) => this.onChangeSlider('size',val)} />
                    <Slider
                        min={1}
                        max={15}
                        onChange={(val) => this.onChangeSlider('size',val)}
                        defaultValue={this.state.size}
                    />
                    <Divider plain orientation="left">Бесконечные броски</Divider>
                    <div>
                        <Button onClick={this.state.isStarted ? this.handlePauseTimer : this.handleStartTimer}>{this.state.isStarted ? 'Пауза' : 'Старт'}</Button>
                        <Button disabled={!this.state.isStarted} onClick={this.handleStopTimer}>Стоп</Button>
                        <Button disabled={!this.state.isStarted} onClick={this.handleRestartTimer}>Рестарт</Button>
                    </div>
                    <Divider plain orientation="left">Кинуть несколько сразу</Divider>
                    <div>
                        <Button disabled={this.state.isStarted} onClick={() => this.handleDropSome(30)}>30</Button>
                        <Button disabled={this.state.isStarted} onClick={() => this.handleDropSome(100)}>100</Button>
                        <Button disabled={this.state.isStarted} onClick={() => this.handleDropSome(1000)}>1000</Button>
                        <Button disabled={this.state.isStarted} onClick={() => this.handleDropSome(10000)}>10000</Button>
                    </div>
                    <div className="text-block">
                        Всего бросков: {this.state.allRoutes.length}
                    </div>
                    {
                        this.state.firstRedStep !== -1 ? 
                            <div className="text-block">
                                Первый повторившийся путь: {this.state.firstRedStep}
                            </div>
                        :('')
                    }
                    {
                        lastPoints.length > 0 ? 
                            <div className="text-block">
                                Первые 30 результатов: {lastPoints.slice(0, 29).join(', ')}
                            </div>
                        :('')
                    }
                    {
                        this.state.repeates[1] > 0 &&
                        <div className="text-block">
                            Повторений 1 раз: {this.state.repeates[1]}
                        </div>
                    }
                    {
                        this.state.repeates[2] > 0 &&
                        <div className="text-block">
                            Повторений 2 раз: {this.state.repeates[2]}
                        </div>
                    }
                    {
                        this.state.repeates[3] > 0 &&
                        <div className="text-block">
                            Повторений 3 раз: {this.state.repeates[3]}
                        </div>
                    }
                    {
                        this.state.repeates[4] > 0 &&
                        <div className="text-block">
                            Повторений 4 раз: {this.state.repeates[4]}
                        </div>
                    }
                    {
                        this.state.repeates.length > 0 &&
                        <div className="text-block">
                            Повторений всего: {this.state.repeates.length > 0 ? this.state.repeates.reduce((a, b) => a + b, 0) : 0}
                        </div>
                    }
                </Col>
                <Col span={12} style={{display:'flex',justifyContent: 'center', flexDirection: 'column'}}>
                    <Divider plain orientation="left">Пространство Элементарных Событий</Divider>
                    <div className="pes-controls">
                        <Radio.Group value={this.state.resultShowMode} onChange={this.onSwitchResultShowMode} buttonStyle="solid">
                            <Radio.Button value="sorted_groups">Сортировать</Radio.Button>
                            <Radio.Button value="ungrouped">Не группировать</Radio.Button>
                            <Radio.Button value="unsorted">Не сортировать</Radio.Button>
                        </Radio.Group>
                        <Button onClick={() => this.handleStopTimer()}>Сбросить</Button>
                    </div>
                    <BoardWithCanvas 
                        {...this.props} 
                        size={this.state.size} 
                        all_routes={this.state.allRoutes}
                        reset_canvas={this.state.reset_canvas}
                        routes_length={this.state.allRoutes.length}
                        setFirstRedStep={this.setFirstRedStep}  />
                    <SampleSpaces  
                        {...this.props} 
                        size={this.state.size} 
                        all_routes={this.state.allRoutes}
                        pes_data={this.state.pesData}
                        pes_data_unsorted={this.state.pesDataUnsorted}
                        pes_data_length={this.state.pesDataUnsorted.length}
                        result_show_mode={this.state.resultShowMode}
                        reset_canvas={this.state.reset_canvas}
                        routes_length={this.state.allRoutes.length}
                        setRepeates={this.setRepeates} />
                </Col>
            </div>
        );
        
    }
}
export default GBHomePage;