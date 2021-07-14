import React, { Component } from 'react';
import {
    Slider,
    InputNumber,
} from 'antd';

class BoardBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        // this.onChangeSlider = this.onChangeSlider.bind(this);
    }

    render() {
        let boardItems = [];
        if(this.props.size && typeof this.props.size === 'number'){
            for(let i = 1; i <= this.props.size; i++){
                let cells = [];
                let cellIndex = 0;
                for(let j = 0; j < (2 * i + 1); j ++){
                    if(j % 2 === 0){
                        cells.push(
                            <td key={j}>
                                <div className="cell-block" dangerouslySetInnerHTML={{__html: '&nbsp;'}} />
                            </td>
                        );
                    }else{
                        cells.push(
                            <td key={j}>
                                <div className="cell-block" dangerouslySetInnerHTML={{__html: `[${i-1};${cellIndex}]<br>&#9899;`}} />
                            </td>
                        );
                        cellIndex ++;
                    }
                }
                boardItems.push(
                    <tr key={i}>
                        {cells}
                    </tr>
                )
            }
        }
        return (
            <table className="board-table">
            {
                boardItems
            }
            </table>
        );
    }
}
export default BoardBlock;