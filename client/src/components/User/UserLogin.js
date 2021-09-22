import axios from 'axios';
import { Input } from 'antd';
import React, { Component } from 'react';
import UserHomePage from './UserHomePage';

class UserLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isTokenActive: false,
            groupId: ''
        };
    }

    componentDidMount() {
        this.checkToken();
    }

    checkToken(){
        axios.get(`/check_token`,{params:{
            token: this.props.match.params.token
        }}).then(response => {
            if(response.data.code !== 200){

            }else{
                this.setState({
                    isTokenActive: true,
                    groupId: response.data.group_id
                })
            }
        })
    }

    render() {
        return (
            this.state.isTokenActive ? (
                <UserHomePage {...this.props} group_id={this.state.groupId} />
            ):(
                <div></div>
            )
        );
    }
}
export default UserLogin;