import React, { Component } from 'react';
import {
    Slider
} from 'antd';

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            size: 1,
        };
        // this.getReportData = this.getReportData.bind(this);
    }

    onChangeSlider(fieldName,fieldValue){
        console.lof(fieldName);
        console.lof(fieldValue);
    }

    render() {
        return (
            <div>
                <div className="control-wrap">
                    <label for="size-input">Размер: </label>
                    <Slider 
                        onChange={(val) => this.onChangeSlider('size',val)}
                        defaultValue={this.state.size} 
                    />
                </div>
            </div>
        );
        
    }
}
export default HomePage;