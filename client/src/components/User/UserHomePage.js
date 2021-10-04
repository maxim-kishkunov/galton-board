import axios from 'axios';
import React, { Component } from 'react';
import { 
    Modal,
 } from 'antd';
 import InputsTable from './InputsTable';
 import ResultsRow from './ResultsRow';
 import StackBarChart from '../../_helpers/StackBarChart';

class UserHomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: {},
        };
        this.getUserData = this.getUserData.bind(this);
        this.checkResultStep = this.checkResultStep.bind(this);
    }

    componentDidMount() {
        if(this.props.group_id)
            this.checkResultStep(this.props.group_id,0,0);
    }

    getUserData(){        
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        axios.get(`/get_user_data`,{params: 
            {
                user_id: currentUser.user_id
            }}
        ).then(response => {
            if(response.data.code !== 200){
                Modal.error({
                    title: 'Error!',
                    content: response.data.message,
                });
            }else{
                this.setState({
                    userData: response.data.data
                })
            }
        })
    }

    checkResultStep(group_id,currStep,value){
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let userData = this.state.userData;
        axios.get(`/check_result_step`,{params: 
            {
                group_id: group_id,
                user_id: currentUser.user_id,
                step: currStep,
                value: value,
            }}
        ).then(response => {
            if(response.data.code !== 200){
                Modal.error({
                    title: 'Error!',
                    content: response.data.message,
                });
            }else{
                this.setState({
                    userData: {...userData, ...response.data.data}
                })
            }
        })
    }

    render() {
        let chartData = [];
        let userResult = [];
        let initialResult = [];
        let initialData = [];
        let board_length = 0;
        let drops_quantity = 0;
        let statMethodResult = [];
        let statMethodChanges = [];
        let statMethodData = [];
        let curr_step = 0;
        if(Object.keys(this.state.userData).length > 0){
            if(this.state.userData.drops_quantity && typeof this.state.userData.drops_quantity !== 'undefined'){
                drops_quantity = this.state.userData.drops_quantity;
            }
            //  User chart results
            if(this.state.userData.userResult && this.state.userData.userResult.length > 0){
                userResult = this.state.userData.userResult;
                for(let i = 0; i < this.state.userData.drops_quantity; i++){
                    let currKey = userResult[i];
                    if(typeof currKey !== 'undefined' && Object.keys(chartData).length > 0 && typeof chartData[currKey] !== 'undefined')
                        chartData[currKey] += 1;
                    else
                        chartData[currKey] = 1;
                }
                curr_step = userResult.length - 1;
            }
            //  /User chart results
            if(this.state.userData.initialResult && this.state.userData.initialResult.length > 0){
                initialResult = this.state.userData.initialResult;
                for(let i = 0; i < this.state.userData.drops_quantity; i++){
                    let currKey = initialResult[i];
                    if(Object.keys(initialData).length > 0 && typeof initialData[currKey] !== 'undefined')
                        initialData[currKey] += 1;
                    else
                        initialData[currKey] = 1;
                }
                let partSum = 0;
                let correction = 0;
                for(let i = 0; i < this.state.userData.drops_quantity; i++){
                    let currKey = initialResult[i];
                    partSum += currKey;
                    if(i % 5 === 0 && i > 0){
                        correction = -1 * Math.round((correction + partSum) / 5);
                        partSum = 0;
                    }
                    statMethodResult.push(currKey + correction);
                    statMethodChanges.push(correction);
                }
                for(let i = 0; i < this.state.userData.drops_quantity; i++){
                    let currKey = statMethodResult[i];
                    if(Object.keys(statMethodData).length > 0 && typeof statMethodData[currKey] !== 'undefined')
                        statMethodData[currKey] += 1;
                    else
                        statMethodData[currKey] = 1;
                }
            }
            if(this.state.userData.board_length)
                board_length = this.state.userData.board_length;
        }
        return (
            <div className="user-page-wrap">
                <div>
                    {
                        Object.keys(initialData).length > 0 ? (
                            <div className="result-with-chart-block">
                                <div>Начальные результаты</div>
                                <ResultsRow
                                    {...this.props}
                                    drops_quantity={drops_quantity}
                                    result_data={initialResult} />
                                <div style={{width: '50%'}}>
                                    <StackBarChart {...this.props}
                                        size={board_length}
                                        bar_height={15}
                                        bar_width={50}
                                        chart_data={initialData}
                                    />
                                </div>
                            </div>
                        ):('')
                    }
                    <div className="result-with-chart-block">
                        <div>Попадание</div>
                        <ResultsRow
                            {...this.props}
                            drops_quantity={drops_quantity}
                            result_data={userResult} />
                        <div>Поправка</div>
                        <InputsTable
                            {...this.props}
                            checkResultStep={this.checkResultStep}
                            user_data={this.state.userData} />
                        <div style={{width: '50%'}}>
                            <StackBarChart {...this.props}
                                size={board_length}
                                bar_height={15}
                                bar_width={50}
                                curr_step={curr_step}
                                chart_data={chartData}
                            />
                        </div>
                    </div>
                    {
                        Object.keys(initialData).length > 0 ? (
                            <div className="result-with-chart-block">
                                <div>Результаты статистического метода</div>
                                <ResultsRow
                                    {...this.props}
                                    drops_quantity={drops_quantity}
                                    result_data={statMethodResult} />
                                <div>Изменения статистического метода</div>
                                <ResultsRow
                                    {...this.props}
                                    drops_quantity={drops_quantity}
                                    result_data={statMethodChanges} />
                                <div style={{width: '50%'}}>
                                    <StackBarChart {...this.props}
                                        size={board_length}
                                        bar_height={15}
                                        bar_width={50}
                                        chart_data={statMethodData}
                                    />
                                </div>
                            </div>
                        ):('')
                    }

                </div>
            </div>
        )
    }
}
export default UserHomePage;