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
} from 'antd';
// import BoardBlock from './BoardBlock'
import BoardWithCanvas from './BoardWithCanvas'

class GBHomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            size: 1,
            allRoutes: [],
            firstRedStep: -1,
            reset_canvas: 0,
        };
        this.onChangeSlider = this.onChangeSlider.bind(this);
        this.handleStartTimer = this.handleStartTimer.bind(this);
        this.handleRestartTimer = this.handleRestartTimer.bind(this);
        this.handlePauseTimer = this.handlePauseTimer.bind(this);
        this.setFirstRedStep = this.setFirstRedStep.bind(this);
        this.handleDropSome = this.handleDropSome.bind(this);
        this.getBoardPES = this.getBoardPES.bind(this);
    }

    componentDidMount(){
        this.getBoardPES();
    }

    onChangeSlider(fieldName,fieldValue){
        this.setState({
            allRoutes: [],
            isPaused: false,
            reset_canvas: + this.state.reset_canvas + 0.00001,
            [fieldName]: fieldValue,            
            pesData: [],
            pesDataFormatted: []
        },() => {
            this.getBoardPES();
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

    handleDropSome(quantity) {
        let allRoutes = [];
        this.setState({
            allRoutes: allRoutes,
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
            reset_canvas: + this.state.reset_canvas + 0.00001
        });
    }

    handleRestartTimer() {
        this.setState({
            allRoutes: [],
            isPaused: false,
            firstRedStep: -1,
            reset_canvas: + this.state.reset_canvas + 0.00001
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

    getBoardPES() {
        const { 
            size
        } = this.state;
        // let ways = [];
        // let numbersArray = [];
        // let resArr = [];
        // for(let i = 0; i < Math.pow(2,size); i++){
        //     let num = i.toString(2);
        //     while(num.length < size)
        //         num = 0 + num;
        //     ways.push(num);
        // }
        // for(let i = 0; i < ways.length; i++){
        //     let num = ways[i];
        //     let newItem = [];
        //     newItem.push(parseInt(num[0]));
        //     for(let j = 1; j < num.length; j++){
        //         newItem.push(parseInt(newItem[j - 1]) + parseInt(num[j]));
        //     }
        //     numbersArray.push(newItem);
        // }
        // for(let i = 0; i <= size; i++){
        //     let items = [];
        //     items = numbersArray.filter(item => item[item.length - 1] === i);
        //     resArr[i] = items;
        // }
        // let formattedArr = {};
        // for(let i = 0; i < resArr.length; i++){
        //   if(resArr[i] && resArr[i].length){
        //     for(let j = 0; j < resArr[i].length; j++){
        //       let currItem = resArr[i][j];
        //       if(typeof currItem !== 'undefined'){
        //         if(typeof formattedArr[currItem[currItem.length - 1]] === 'undefined')
        //           formattedArr[currItem[currItem.length - 1]] = [];
      
        //         formattedArr[currItem[currItem.length - 1]].push(currItem.map((currItem,index,arr) => index > 0 ? currItem === arr[index - 1] ? 0 : 1 : currItem ));
        //       }
        //     }
        //   }
        // }
        // this.setState({
        //     pesData: resArr,
        //     pesDataFormatted: formattedArr
        // })

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
                    // pesData: response.data.data,
                    pesDataFormatted: JSON.parse(response.data.data.formatted_spaces_json)
                })
            }
        })
        
    }

    render() {
        const {allRoutes} = this.state;

        let lastPoints = '';
        allRoutes.map((item, index, array) => {
            lastPoints += item[item.length - 1] + (index < array.length ? ', ' : '');
        });

        let pes = this.state.pesDataFormatted;
        let pesDom = [];
        let index = 0;
        if(pes && Object.keys(pes).length > 0){ 
            Object.keys(pes).forEach(function(currKey){
                let arrItems = [];
                let currItems = pes[currKey];
                Object.keys(currItems).forEach(function(arrKey){
                    let itemsArr = [];
                    let currItem = currItems[arrKey];
                    Object.keys(currItem).forEach(function(itemsKey){
                        itemsArr.push(
                            <div key={arrKey + '_num_item_' + index} className={`pes-number-item${currItem[itemsKey] === 1 ? ' right' : ' left'}`}></div>
                        );
                        index += 1;
                    });
                    arrItems.push(<div key={currKey + '_' + arrKey + index} className="pes-item">{itemsArr}</div>);
                });
                pesDom.push(
                    <div key={currKey + '_block_' + index} className="pes-block">
                        <div className="pes-label">{currKey}</div>
                        <div className="pes-items-wrap">{arrItems}</div>
                    </div>
                );
            })
        }
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
                        <Button disabled={this.timer} onClick={this.handleStartTimer}>Старт</Button>
                        <Button onClick={this.handlePauseTimer}>Пауза</Button>
                        <Button onClick={this.handleRestartTimer}>Рестарт</Button>
                    </div>
                    <Divider plain orientation="left">Кинуть несколько сразу</Divider>
                    <div>
                        <Button disabled={this.timer} onClick={() => this.handleDropSome(30)}>30</Button>
                        <Button disabled={this.timer} onClick={() => this.handleDropSome(100)}>100</Button>
                        <Button disabled={this.timer} onClick={() => this.handleDropSome(1000)}>1000</Button>
                        <Button disabled={this.timer} onClick={() => this.handleDropSome(10000)}>10000</Button>
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
                        lastPoints.length > 0 && allRoutes.length <= 30 ? 
                            <div className="text-block">
                                Результаты: {lastPoints.substr(0, lastPoints.length - 2)}
                            </div>
                        :('')
                    }
                </Col>
                <Col span={12} style={{display:'flex',justifyContent: 'center', flexDirection: 'column'}}>
                    <BoardWithCanvas 
                        {...this.props} 
                        size={this.state.size} 
                        all_routes={this.state.allRoutes}
                        reset_canvas={this.state.reset_canvas}
                        routes_length={this.state.allRoutes.length}
                        setFirstRedStep={this.setFirstRedStep}  />
                    {
                        pes && Object.keys(pes).length > 0 ? 
                            <div className="pes" style={{ width: document.documentElement.clientWidth }}>
                                {pesDom}
                            </div>
                        :('')
                    }
                </Col>
            </div>
        );
        
    }
}
export default GBHomePage;