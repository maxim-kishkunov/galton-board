import axios from 'axios';
import React, { Component } from 'react';
import { 
    InputNumber,
 } from 'antd';

class ResultsRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currStep: 0,
        };
    }

    componentDidMount() {
    }

    render() {
        const {
            drops_quantity,
            userResult
        } = this.props.user_data;
        let tableColumns = [];
        if(drops_quantity && userResult){
            for(let i = 0; i < drops_quantity; i ++){
                tableColumns.push(
                    <div key={`result-cell_${i}`} className="table-cell">{userResult[i]}</div>
                )
            }
        }
        return (
            <div className="results-row">
                {tableColumns}
            </div>
        );
    }
}
export default ResultsRow;