import axios from 'axios';
import React, { Component } from 'react';
// import { 
//     Modal,
//  } from 'antd';

class InputsTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userRole: '',
        };
        // this.checkUserRole = this.checkUserRole.bind(this);
    }

    componentDidMount() {
        this.getUserData();
    }

    getTableData(){        
        axios.get(`/get_user_data`).then(response => {
            if(response.data.code !== 200){
                Modal.error({
                    title: 'Error!',
                    content: response.data.message,
                });
            }else{
                this.setState({
                    tableData: response.data.data,
                    groupData: response.data.group_data
                })
            }
        })
    }

    render() {
        return (
            <div className="user-inputs-table">
                
            </div>
        );
    }
}
export default InputsTable;