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
        this.checkResultStep(0,0);
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

    checkResultStep(currStep,value){
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let userData = this.state.userData;
        axios.get(`/check_result_step`,{params: 
            {
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
        let initialData = [];
        let board_length = 0;
        if(Object.keys(this.state.userData).length > 0){
            if(this.state.userData.userResult && this.state.userData.userResult.length > 0){
                let userResult = this.state.userData.userResult;
                for(let i = 0; i < this.state.userData.drops_quantity; i++){
                    let currKey = userResult[i];
                    if(Object.keys(chartData).length > 0 && typeof chartData[currKey] !== 'undefined')
                        chartData[currKey] += 1;
                    else
                        chartData[currKey] = 1;
                }
            }
            if(this.state.userData.initialResult && this.state.userData.initialResult.length > 0){
                let initialResult = this.state.userData.initialResult;
                for(let i = 0; i < this.state.userData.drops_quantity; i++){
                    let currKey = initialResult[i];
                    if(Object.keys(initialData).length > 0 && typeof initialData[currKey] !== 'undefined')
                        initialData[currKey] += 1;
                    else
                        initialData[currKey] = 1;
                }
            }
            if(this.state.userData.board_length)
                board_length = this.state.userData.board_length;
        }
        return (
            <div className="user-page-wrap">
                <div>
                    <ResultsRow
                        {...this.props}
                        user_data={this.state.userData} />
                    <InputsTable
                        {...this.props}
                        checkResultStep={this.checkResultStep}
                        user_data={this.state.userData} />
                    <div style={{display:'flex',justifyContent: 'center', flexDirection: 'column'}}>
                        <div style={{width: '50%'}}>
                            <StackBarChart {...this.props}
                                size={board_length}
                                chart_data={chartData}
                            />
                        </div>
                    </div>
                    {
                        Object.keys(initialData).length > 0 ? (
                            <div style={{display:'flex',justifyContent: 'center', flexDirection: 'column'}}>
                                <div>Начальные результаты</div>
                                <div style={{width: '50%'}}>
                                    <StackBarChart {...this.props}
                                        size={board_length}
                                        chart_data={initialData}
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