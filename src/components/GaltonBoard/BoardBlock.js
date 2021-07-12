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
                for(let j = 0; j < (2 * i + 1); j ++){
                    console.log(j);
                    console.log(this.props.size);
                    cells.push(
                        <td key={j}>
                        {
                            j % 2 === 0 ?(
                                <div className="cell-block" dangerouslySetInnerHTML={{__html: '&nbsp;'}} />
                            ):(
                                <div className="cell-block" dangerouslySetInnerHTML={{__html: '&#9899;'}} />
                            )
                        }
                        </td>
                    )
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