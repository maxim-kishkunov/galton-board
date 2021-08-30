import axios from 'axios';
import React, { Component } from 'react';
import { 
    Modal,
 } from 'antd';
 import UsersTable from './UsersTable.js';

class LecturerHomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userRole: '',
        };
        // this.checkUserRole = this.checkUserRole.bind(this);
    }

    // componentDidMount() {
    //     this.checkUserRole();
    // }

    render() {
        return (
            <UsersTable {...this.props} />
        );
    }
}
export default LecturerHomePage;