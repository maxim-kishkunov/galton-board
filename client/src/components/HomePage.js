import axios from 'axios';
import React, { Component } from 'react';
import { 
    Modal,
 } from 'antd';
 import LecturerHomePage from './Lecturer/LecturerHomePage.js';
 import UserHomePage from './User/UserHomePage.js';
 import Auth from './auth/Auth'

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userRole: '',
        };
        this.checkUserRole = this.checkUserRole.bind(this);
    }

    componentDidMount() {
        this.checkUserRole();
    }

    checkUserRole(){
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if(currentUser && Object.keys(currentUser).length > 0){
            axios.get(`/check_user_role`,{params: 
                {
                    user_id: currentUser.user_id
                }}
            ).then(response => {
                if(response.data.code !== 200){
                    Auth.logOut();
                }else{
                    this.setState({
                        userRole: response.data.role
                    })
                }
            })
        }
    }

    render() {
        return (
            <div className="general-wrap">
            {
                this.state.userRole === 'user' ? (
                    <UserHomePage {...this.props} />
                ): (
                    <LecturerHomePage {...this.props} />                        
                )
            }
            </div>
        );
    }
}
export default HomePage;