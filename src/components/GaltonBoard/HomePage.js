import React, { Component } from 'react';
import {
    Slider,
    Col,
} from 'antd';
import BoardBlock from './BoardBlock'

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            size: 1,
        };
        this.onChangeSlider = this.onChangeSlider.bind(this);
    }

    onChangeSlider(fieldName,fieldValue){
        this.setState({
            [fieldName]: fieldValue
        })
    }

    handleStartTimer() {
        this.timer = setInterval(() => {
            
            this.timer = setInterval(() => {

            }, 500);
        }, 500);
    }

    handleStopTimer() {
    }

    startPath() {
        let newPath = [];
        this.timer = setInterval(() => {

        }, 500);
    }

    render() {
        return (
            <div>
                <div className="control-wrap">
                    <label>Размер:</label>
                    <Slider
                        min={1}
                        max={30}
                        onChange={(val) => this.onChangeSlider('size',val)}
                        defaultValue={this.state.size}
                    />
                    <div>
                        <Button onClick={this.handleStartTimer}>Старт</Button>
                        <Button onClick={this.handleStopTimer}>Стоп</Button>
                    </div>
                </div>
                <div>
                    <Col span={12} style={{display:'flex',justifyContent: 'center'}}>
                        <BoardBlock {...this.props} size={this.state.size} />
                    </Col>
                </div>
            </div>
        );
        
    }
}
export default HomePage;