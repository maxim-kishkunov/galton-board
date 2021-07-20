import React, { Component } from 'react';

class BoardBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    
    objectsAreSame(x, y) {
        let objectsAreSame = true;
        for(var propertyName in x) {
           if(x[propertyName] !== y[propertyName]) {
              objectsAreSame = false;
              break;
           }
        }
        return objectsAreSame;
    }
     
    render() {
        const {size, allRoutes} = this.props;
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
                        let redLeftLine = false;
                        let redRightLine = false;

                        if(allRoutes){
                            for(let k = 0; k < allRoutes.length; k++){
                                let currItem = allRoutes[k]; //Текущий путь падения шарика
                                let isDoubleWay = false;
                                if(
                                    allRoutes.filter(item => 
                                            item
                                            && item.length - 1 === size
                                            && item.join() === currItem.join()).length > 1
                                ){
                                    isDoubleWay = true;
                                }

                                if(currItem.length - 1 === currRow && currItem[currRow] === currCell){
                                    redPoint = true;
                                }
                                if(currRow === 0 || (currItem.length > currRow && currItem[currRow] === currCell)){
                                    if(currItem[currRow + 1] === currCell){
                                        leftLine = true;
                                        if(isDoubleWay)
                                            redLeftLine = true;
                                    }
                                    if(currItem[currRow + 1] === (currCell + 1)){
                                        rightLine = true;
                                        if(isDoubleWay)
                                            redRightLine = true;
                                    }
                                }
                            }
                        }
                        cells.push(
                            <td key={j}>
                                <div className={`cell-block${redPoint ? ' red' : ''}`} />
                                {
                                    leftLine &&
                                        <hr className={`left${redLeftLine ? ' red' : ''}`}  />
                                }
                                {
                                    rightLine &&
                                        <hr className={`right${redRightLine ? ' red' : ''}`}  />
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