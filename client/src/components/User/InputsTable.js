import axios from 'axios';
import React, { Component } from 'react';
import { 
    InputNumber,
 } from 'antd';

class InputsTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            disabledInput: {},
            currStep: 0,
        };
        this.handleChangeCell = this.handleChangeCell.bind(this);
        this.handleOnBlur = this.handleOnBlur.bind(this);
    }

    componentDidMount() {
    }

    handleChangeCell(value, fieldName) {
        this.setState({
            [fieldName]: value,
        });
    }

    handleOnBlur(currStep, inputName) {
        const {disabledInput} = this.state;
        if(!disabledInput[inputName]){
            disabledInput[inputName] = true;
        }

        this.setState({
            currStep: currStep,
            disabledInput: disabledInput
        },()=>{
            this.props.checkResultStep(currStep,inputName);
        })
    }

    render() {
        const {drops_quantity} = this.props.user_data;
        const {disabledInput} = this.state;
        let tableColumns = [];
        if(drops_quantity){
            for(let i = 0; i < drops_quantity; i ++){
                let currInputName = `output_${i}`;
                tableColumns.push(
                    <div className="table-cell">
                        <InputNumber
                            style={{ width: 55 }}
                            disabled={disabledInput[currInputName] || this.state.currStep !== i}
                            onBlur={(e)=>this.handleOnBlur(i,currInputName)}
                            type="number"
                            name={currInputName}
                            onChange={(value) => this.handleChangeCell(value,currInputName)}/>
                    </div>
                )
            }
        }
        return (
            <div className="user-inputs-table">
                {tableColumns}
            </div>
        );
    }
}
export default InputsTable;