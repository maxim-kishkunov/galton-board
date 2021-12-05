import axios from 'axios';
import React, { Component } from 'react';
// import { 
//     Modal,
//  } from 'antd';
 import LecturerHomePage from './Lecturer/LecturerHomePage.js';
 import UserHomePage from './User/UserHomePage.js';
 import Auth from './auth/Auth'

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
        };
        this.checkUser = this.checkUser.bind(this);
    }

    async componentDidMount() {
        await this.checkUser();
    }

    checkUser(){
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if(currentUser && Object.keys(currentUser).length > 0){
            axios.get(`http://ktpsys.ddns.net:84/check_user`,{params: 
                {
                    user_id: currentUser.user_id
                }}
            ).then(response => {
                if(response.data.code !== 200){
                    Auth.logOut();
                }else{
                    this.setState({
                        userName: response.data.name
                    })
                }
            })
        }
    }

    render() {
        return (
            <div className="general-wrap">
            {
                this.state.userName.length > 0 ? (
                    <LecturerHomePage {...this.props} /> 
                ):(
                    <div></div>                     
                )
            }
            </div>
        );
    }
}
export default HomePage;