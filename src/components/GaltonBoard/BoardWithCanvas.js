import React, { Component } from 'react'

class BoardWithCanvas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isPointDrawed: false,
            isPointShown: false,
            storedSize: 0,
            lastShownRoute: 0,
            shownRoutes: [],
            firstRedStep: -1,

            shownPiecesBlack: [],
            shownPiecesRed: [],
        }
        this.canvasRef = React.createRef();

        this.drawPoints = this.drawPoints.bind(this);
        this.updateCanvas = this.updateCanvas.bind(this);
    }

    componentDidMount() {    
        this.updateCanvas();
    }

    componentDidUpdate(prevProps) {
        if(prevProps.size !== this.props.size || (prevProps.routes_length !== this.props.routes_length)) {
            this.updateCanvas();
        }
    }

    drawPoints(){
        const {size} = this.props;
        
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');

        ctx.canvas.width  = window.innerWidth /2;
        ctx.canvas.height = 16 * (size + 2) + 200;
    
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    
        for(let i = 1; i <= size; i++){
            let margin = (size - Math.floor(i + 1/ 2)) * 16;
            for(let j = 0; j < i; j ++){
                ctx.fillStyle = '#000000';
                ctx.beginPath();
                
                let x = 32 + j * 32 + margin; // x coordinate
                let y = 16 + i * 16; // y coordinate
                let radius = 8; // Arc radius
                let startAngle = 0; // Starting point on circle
                let endAngle = Math.PI * 2; // End point on circle
                let counterclockwise = i % 2 !== 0; // clockwise or counterclockwise
        
	            // ctx.fillText(j,x,y-16); //index of point shown below point
	            // ctx.fillText('<'+j,x + 8,y+ 4); //index of point shown below point
                ctx.arc(x, y, radius, startAngle, endAngle, counterclockwise);
                ctx.fill();
            }
        }

        this.setState({
            storedSize: size,
            isPointDrawed: true,
        })
    }

    drawRoutes(){
        const {size, all_routes} = this.props;
        let {lastShownRoute, shownRoutes} = this.state;

        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');

        let routesLength = all_routes.length;
        
        if(routesLength > 0){
            for(let i = lastShownRoute; i < routesLength; i++){
                let currRoute = all_routes[i];

                let isThisRouteShown = shownRoutes.find(item => item && item === currRoute.join());
                if(currRoute.join().length <= size || typeof isThisRouteShown === 'undefined'){
                    let startX = 16 + (size - Math.floor(1/ 2)) * 16;
                    let startY = 32;// + i * 16;
                    ctx.beginPath();
                    ctx.moveTo(startX, startY);
                    for(let j = 0; j < currRoute.length; j++){
                        let margin = (size - Math.floor(j + 1/ 2)) * 16;
                        let currX = currRoute[j] * 32 + margin;
                        let currY = 32 + j * 16;
                        if(j > 0){
                            ctx.lineTo(currX, currY);
                            ctx.strokeStyle = '#000000';
                            ctx.stroke();
                        }
                    }
                    if(currRoute.length === size + 1){
                        lastShownRoute = i;
                        shownRoutes.push(currRoute.join());
                    }
                }else if(typeof isThisRouteShown !== 'undefined'){
                    let startX = (size - Math.floor(1/ 2)) * 16;
                    let startY = 32;// + i * 16;
                    ctx.beginPath();
                    ctx.moveTo(startX, startY);
                    for(let j = 0; j < currRoute.length; j++){
                        let margin = (size - Math.floor(j + 1/ 2)) * 16;
                        let currX = currRoute[j] * 32 + margin;
                        let currY = 32 + j * 16;
                        if(j > 0){
                            ctx.lineTo(currX, currY);
                            ctx.strokeStyle = '#f00';
                            ctx.stroke();
                        }
                    }
                }
            }
            this.setState({
                shownRoutes: shownRoutes,
                lastShownRoute: lastShownRoute,
            })
        }
    }

    drawRoutesByPiece(){
        const {size, all_routes} = this.props;
        let {lastShownRoute, shownRoutes, shownPiecesBlack} = this.state;

        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');

        let routesLength = all_routes.length;
        
        if(routesLength > 0 && lastShownRoute < routesLength){
            for(let i = lastShownRoute; i < routesLength; i++){
                let currRoute = all_routes[i];
                let isThisRouteShown = shownRoutes.filter(item => item && item === currRoute.join());
                if(currRoute.join().length <= size || isThisRouteShown.length === 0){
                    let startX = 16 + (size - Math.floor(1/ 2)) * 16;
                    let startY = 32;// + i * 16;
                    ctx.beginPath();
                    ctx.moveTo(startX, startY);
                    // if(currRoute.length === size + 1){
                    //     console.log('ololo');
                    // }
                    for(let j = 1; j < currRoute.length; j++){
                        // if(j === size){
                        //     console.log('ololo');
                        // }
                        let piece = j-1 + ':' + currRoute[j-1] + ',' + (j) + ':' + currRoute[j];
                        let margin = (size - Math.floor(j + 1/ 2)) * 16;
                        let currX = 16 + currRoute[j] * 32 + margin;
                        let currY = 32 + j * 16;
                        if(shownPiecesBlack.filter(item => item && item === piece).length === 0){
                            ctx.lineTo(currX, currY);
                            ctx.strokeStyle = '#000000';
                            ctx.stroke();
                            shownPiecesBlack.push(piece);
                        }else{
                            ctx.moveTo(currX, currY);
                        }
                    }
                    if(currRoute.length === size + 1){
                        lastShownRoute = i + 1;
                        shownRoutes.push(currRoute.join());
                    }
                }else if(isThisRouteShown.length > 0){
                    if(this.state.firstRedStep === -1){
                        this.props.setFirstRedStep(lastShownRoute);
                        this.setState({
                            firstRedStep: lastShownRoute,
                        })
                    }
                    let startX = 16 + (size - Math.floor(1/ 2)) * 16;
                    let startY = 32;// + i * 16;
                    ctx.beginPath();
                    ctx.moveTo(startX, startY);
                    for(let j = 0; j < currRoute.length; j++){
                        let margin = (size - Math.floor(j + 1/ 2)) * 16;
                        let currX = 16 + currRoute[j] * 32 + margin;
                        let currY = 32 + j * 16;
                        if(j > 0){
                            ctx.lineTo(currX, currY);
                            ctx.strokeStyle = '#f00';
                            ctx.stroke();
                        }
                    }
                }
            }
            this.setState({
                shownRoutes: shownRoutes,
                lastShownRoute: lastShownRoute,
                shownPiecesBlack: shownPiecesBlack,
            })
        }
    }

    drawStackBarChart(){
        const {size, bar_chart_data} = this.props;
        
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        ctx.beginPath();
        let ratio = 1;

        let maxDigitQuantity = Math.max(...bar_chart_data).toString().length - 1;
        for(let i = 0; i < maxDigitQuantity; i++){
            ratio = ratio / 10;
        }
        ctx.clearRect(0, 32 + 16 * size, ctx.canvas.width, 200)
        for(let i = 0; i <= size; i++){
            let startX = i * 32;
            let barLength = bar_chart_data[i] * ratio;
            let startY = (32 + 16 * size) + 15 * (10 - barLength);//16 * size + 168;
                        
            ctx.fillStyle='#070';
            ctx.fillRect(startX,startY,30, barLength * 15);
            ctx.fillStyle = '#000000';
            ctx.fillText(bar_chart_data[i],startX + 10,startY - 1); //index of point shown below point

            ctx.stroke();
            
            // for(let j = 0; j < barLength; j++){
            //     columns.push(
            //         <div key={`line-item${i}_${j}`} className="bar-line-item"></div>
            //     )
            // }              
            // chartData.push(
            //     <div key={`item_${i}`} className="bar-item">
            //         {columns}
            //         <div className="bar-item-quantity">
            //             {bar_chart_data[i]}
            //         </div>
            //     </div>
            // )
        }
    }
      
    updateCanvas(){
        const {size, all_routes} = this.props;

        if(!this.state.isPointDrawed || this.state.storedSize !== size){
            this.drawPoints();
        }
        if(!this.state.lastShownRoute !== all_routes.length){
            this.drawRoutesByPiece();
            this.drawStackBarChart();
        }
    }

    render() {
        return (
            <canvas ref={this.canvasRef} {...this.props}/>
        );
    }    
}

export default BoardWithCanvas