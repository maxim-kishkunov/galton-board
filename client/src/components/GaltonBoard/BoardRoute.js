import React, { Component } from 'react';
import BoardRouteStep from './BoardRouteStep'

class BoardRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        // this.renderBoardPoints = this.renderBoardPoints.bind(this);
    }

    render() {
        const {size, data} = this.props;
        let result = [];
        
        for(let i = 0; i < size; i++){
            let routeStepCurr = data[i];
            let routeStepNext = data[i + 1];
            let cells = [];
            let maxCountCells = (3 * (i + 1)) + i;
            for(let j = 0; j < maxCountCells; j ++){
                cells.push(
                    <BoardRouteStep 
                        {...this.props} 
                        key={`step-${j}`}
                        index={j}
                        rowIndex={i-1}
                        maxCountCells={maxCountCells}
                        routeStepCurr={routeStepCurr}
                        routeStepNext={routeStepNext}
                    />
                );
            }
            result.push(
                <tr key={i} className="route-section point-row">
                    <td></td>
                </tr>
            );
            result.push(
                <tr key={i} className="route-section">
                    {cells}
                </tr>
            );
        }

        return (
            <div className="board-routes">
                <div className="routes-inner">
                    <table className="routes-table">
                        <tbody>
                            {result}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}
export default BoardRoute;