import axios from 'axios';
import React, { Component } from 'react';
import { 
    Modal,
 } from 'antd';

class LecturerHomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.getAllGroups = this.getAllGroups.bind(this);
    }

    componentDidMount() {
        this.getAllGroups();
    }

    getAllGroups(){        
        axios.get(`/get_groups`,{params: 
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
                    userRole: response.data.role
                })
            }
        })
    }

    render() {
        return (
            <div>LecturerHomePage</div>
        );
    }
}
export default LecturerHomePage;