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
        this.getUserData();
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
        let board_length = 0;
        if(this.state.userData){
            if(this.state.userData.userResult && this.state.userData.userResult.length > 0){
                let userResult = this.state.userData.userResult;
                for(let i = 0; i < this.state.userData.drops_quantity; i++){
                    let currKey = userResult[i];
                    if(chartData.length > 0 && typeof chartData[currKey] !== 'undefined')
                        chartData[currKey] += 1;
                    else
                        chartData[currKey] = 1;
                }
            }
            if(this.state.userData.board_length)
                board_length = this.state.userData.board_length;
        }
        return (
            <div className="user-page-wrap">
                {
                    this.state.userData && this.state.userData.user_outputs && this.state.userData.user_outputs.length > 0 ? (
                        <div>results</div>
                    ):(
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
                        </div>
                    )
                }
            </div>
        )
    }
}
export default UserHomePage;