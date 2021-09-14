import React, { Component } from 'react';
// import { 
//     InputNumber,
//  } from 'antd';

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
            result_data
        } = this.props;
        let tableColumns = [];
        if(drops_quantity && result_data){
            for(let i = 0; i < drops_quantity; i ++){
                tableColumns.push(
                    <div key={`result-cell_${i}`} className="table-cell">{result_data[i]}</div>
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