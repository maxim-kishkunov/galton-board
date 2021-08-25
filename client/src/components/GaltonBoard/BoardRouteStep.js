import React, { Component } from 'react';

class BoardRouteStep extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        // this.renderBoardPoints = this.renderBoardPoints.bind(this);
    }

    render() {
        const {
            index,
            rowIndex,
            routeStepCurr,
            routeStepNext,
            maxCountCells,
        } = this.props;

        let data = [];

        // if(i % 4 === 0) => L
        // if(i % 4 === 2) => R 

        if(index % 2 === 0){
            if(index % 4 === 0 && routeStepNext - routeStepCurr === 0 && index / 4 === routeStepCurr){
                data.push(
                    <hr className="left"></hr>
                )
            }
            if(index % 4 === 2 && routeStepNext - routeStepCurr === 1 && (index - 2) / 4 === routeStepCurr){
                data.push(
                    <hr className="right"></hr>
                )
            }
        }
        
        return (
            <td>
                {data}
            </td>
        );
    }
}
export default BoardRouteStep;