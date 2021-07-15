import React, { Component } from 'react';
import {
    Slider,
    InputNumber,
} from 'antd';
import { Redirect } from 'react-router-dom';

class BoardBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        // this.onChangeSlider = this.onChangeSlider.bind(this);
    }

    render() {
        const {size, allWays} = this.props;
        let boardItems = [];
        if(size && typeof size === 'number'){
            for(let i = 1; i <= size; i++){
                let cells = [];
                let cellIndex = 0;
                for(let j = 0; j < (2 * i + 1); j ++){
                    if(j % 2 === 0){
                        cells.push(
                            <td key={j}>
                                &nbsp;
                            </td>
                        );
                    }else{
                        let currRow = i - 1;
                        let currCell = cellIndex;
                        let leftLine = false;
                        let rightLine = false;
                        let redPoint = false;
                        if(allWays){
                            for(let k = 0; k < allWays.length; k++){
                                let currItem = allWays[k];
                                if(currItem.length - 1 === currRow && currItem.find(item => item && item.cell === currCell && item.row === currRow)){
                                    redPoint = true;
                                }
                                if(currRow === 0 || (currItem.length > currRow && currItem.find(item => item && item.row === currRow - 1 && item.childCell === currCell))
                                ){
                                    if(currItem.find(item => item && item.row === currRow + 1 && item.cell === currCell))
                                        leftLine = true;
                                    if(currItem.find(item => item && item.row === currRow + 1 && item.cell === currCell + 1))
                                        rightLine = true;
                                }
                            }
                        }
                        cells.push(
                            <td key={j}>
                                <div className={`cell-block${redPoint ? ' red' : ''}`} />
                                {
                                    leftLine &&
                                        <hr className="left" />
                                }
                                {
                                    rightLine &&
                                        <hr className="right" />
                                }
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
                <tbody>
                {
                    boardItems
                }
                </tbody>
            </table>
        );
    }
}
export default BoardBlock;