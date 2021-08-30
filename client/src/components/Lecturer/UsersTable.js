import axios from 'axios';
import React, { Component } from 'react';
import { 
    Modal,
 } from 'antd';

class LecturerHomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: [],
        };
        this.getTableData = this.getTableData.bind(this);
    }

    componentDidMount() {
        this.getTableData();
    }

    getTableData(){        
        axios.get(`/get_lect_data`).then(response => {
            if(response.data.code !== 200){
                Modal.error({
                    title: 'Error!',
                    content: response.data.message,
                });
            }else{
                this.setState({
                    tableData: response.data.data
                })
            }
        })
    }

    render() {
        return (
            <div className="users-table">
                { 
                    this.state.tableData.length > 0 ? (
                        this.state.tableData.map(function (item, index) {
                            return <div key={row.ProjectUID + index + '1'}><td>{item}</td></tr>
                        })
                    ):('')
                }
            </div>
        );
    }
}
export default LecturerHomePage;