import axios from 'axios';
import React, { Component } from 'react';
import { 
    Modal,
 } from 'antd';
 import InputsTable from './InputsTable'

class UserHomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: {},
        };
        this.getUserData = this.getUserData.bind(this);
    }

    componentDidMount() {
        this.getUserData();
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
                    userData: response.data.data,
                })
            }
        })
    }

    checkResultStep(currStep,value){
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
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
                    userData: response.data.data,
                })
            }
        })
    }

    render() {
        return (
            <div className="user-page-wrap">
                {
                    this.state.userData && this.state.userData.user_outputs && this.state.userData.user_outputs.length > 0 ? (
                        <div>results</div>
                    ):(
                        <InputsTable 
                            {...this.props}
                            next_step
                            checkResultStep={this.checkResultStep} 
                            user_data={this.state.userData} />
                    )
                }
            </div>
        )
    }
}
export default UserHomePage;