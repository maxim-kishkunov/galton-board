import axios from 'axios';
import React, { Component } from 'react';
import { 
    Modal,
 } from 'antd';

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
            <div>LecturerHomePage</div>
        );
    }
}
export default LecturerHomePage;