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

    componentDidUpdate(prevProps) {
        if(this.props.user_data &&
            prevProps.user_data !== this.props.user_data &&
            this.props.user_data.userOutput &&
            this.props.user_data.userOutput.length > 0
        ){
            let outputData = this.props.user_data.userOutput;
            this.setState({
                currStep: outputData.length
            })
        }
    }

    handleChangeCell(value, fieldName) {
        this.setState({
            [fieldName]: value,
        });
    }

    handleOnBlur(currStep, inputName) {
        if(typeof this.state[inputName] === 'undefined')
            return false;
            
        const {disabledInput} = this.state;
        if(!disabledInput[inputName]){
            disabledInput[inputName] = true;
        }
            
        currStep += 1;
        this.setState({
            currStep: currStep,
            disabledInput: disabledInput
        },()=>{
            let stepValue = this.state[inputName];
            this.props.checkResultStep(this.props.group_id, currStep,stepValue);
        })
    }

    render() {
        const {drops_quantity} = this.props.user_data;
        const {disabledInput} = this.state;
        let tableColumns = [];
        if(drops_quantity){
            let outputData = [];
            if(this.props.user_data.userOutput)
                outputData = this.props.user_data.userOutput;

            for(let i = 0; i < drops_quantity - 1; i ++){
                let currInputName = `output_${i}`;
                tableColumns.push(
                    <div  key={`input-cell_${i}`} className="table-cell">
                        {
                            typeof outputData[i] !== 'undefined' ? 
                                outputData[i]
                            :(
                                <InputNumber
                                    style={{ width: '100%' }}
                                    disabled={disabledInput[currInputName] || this.state.currStep !== i}
                                    onBlur={(e)=>this.handleOnBlur(i,currInputName)}
                                    type="number"
                                    name={currInputName}
                                    onChange={(value) => this.handleChangeCell(value,currInputName)}/>
                            )
                        }
                        
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