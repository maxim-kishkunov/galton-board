import axios from 'axios';
import React, { Component } from 'react';
// import { 
//     Modal,
//  } from 'antd';
 import InputsTable from './InputsTable'

class UserHomePage extends Component {
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
            <InputsTable {...this.props} />
        );
    }
}
export default UserHomePage;