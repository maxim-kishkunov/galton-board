import React, { Component } from 'react'

let firstRepeat = -1;
class SampleSpaces extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pesDom: [],
        }
        this.preparePESData = this.preparePESData.bind(this);
    }

    componentDidMount() {    
        this.preparePESData();
    }

    componentDidUpdate(prevProps) {
        if(prevProps.result_show_mode !== this.props.result_show_mode 
            || (prevProps.routes_show_mode !== this.props.routes_show_mode) 
            || (prevProps.routes_length !== this.props.routes_length) 
            || (prevProps.pes_data_length !== this.props.pes_data_length) 
            || prevProps.reset_canvas !== this.props.reset_canvas ) 
        {
            firstRepeat = -1;
            this.preparePESData();
        }
    }

    preparePESData(){
        let pesDataUnsorted = this.props.pes_data_unsorted;
        let pes = this.props.pes_data;
        let allRoutes = this.props.all_routes;
        let repeates = [];
        let routesShowMode = this.props.routes_show_mode;

        if(this.props.result_show_mode === 'ungrouped'){
            let chunk_size = 120;
            pes = pesDataUnsorted.map( function(e,i){ 
                return i % chunk_size===0 ? pesDataUnsorted.slice(i,i + chunk_size) : null; 
           }).filter(function(e){ return e; });
        }else if(this.props.result_show_mode === 'unsorted'){
            let shuffled = pesDataUnsorted
                .map((value) => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value)
            let chunk_size = 120;
            pes = shuffled.map( function(e,i){ 
                return i % chunk_size===0 ? shuffled.slice(i,i + chunk_size) : null; 
            }).filter(function(e){ return e; });
        }
        let pesDom = [];
        let index = 0;
        let firstRepeatRoute = [];
        if(pes && Object.keys(pes).length > 0){
            pesDom = Object.keys(pes).map(function (currKey) {
                let currItems = pes[currKey];
                let arrItems = Object.keys(currItems).map(function (arrKey) {
                    let currItem = currItems[arrKey];
                    let itemsArr = [];
                    let itemsLength = 1;
                    if(routesShowMode === `many_squares`){
                        itemsArr = Object.keys(currItem).map(function (itemsKey) {
                            let showRight = true;
                            if((itemsKey > 0 && currItem[itemsKey] === currItem[itemsKey - 1]) || currItem[itemsKey] === 0)
                                showRight = false;
                            return(
                                <div key={itemsKey + '_num_item_' + index} className={`pes-number-item${showRight ? ' right' : ' left'}`}></div>
                            )
                        });
                        itemsLength = itemsArr.length;
                    }else if(routesShowMode === `one_square`){
                        itemsArr = (<div key="0_num_item_0" className="pes-number-item left"></div>)
                    }
                    let currRouteItems = allRoutes.filter(item => item && item.join() === ('0,' + currItem.join()));
                    let isChecked = currRouteItems.length > 0;
                    let isDoubled = currRouteItems.length > 1;
                    let isFirstRepeat = false;
                    if(isDoubled){
                        if(firstRepeat === -1){
                            isFirstRepeat = true;
                            firstRepeat = currKey;
                        }
                        if(typeof repeates[currRouteItems.length - 1] === `undefined`){
                            repeates[currRouteItems.length - 1] = 1;
                        }else{
                            repeates[currRouteItems.length - 1] ++;
                        }
                    }
                    return(
                        <div key={currKey + '_' + arrKey + index} className={`pes-item-wrap${isDoubled ? ' double' : ''}`}>
                            <div 
                                className={`pes-item${isFirstRepeat ? ' first-repeat' : ''}${isChecked ? ' checked' : ''}${isDoubled ? ' double' : ''}`} 
                                style={
                                    this.props.result_show_mode === 'sorted_groups' ? 
                                        {width: (itemsLength * 7 + 2)}
                                    :{}}
                            >
                                {itemsArr}
                            </div>
                            {
                                isDoubled ? <div className="pes-number-quantity">{currRouteItems.length}</div> : ('')
                            }
                        </div>)
                }, this);

                return(
                    <div key={currKey + '_block_' + index} className="pes-block">
                        <div className="pes-label">{currKey}</div>
                        <div className="pes-items-wrap">{arrItems}</div>
                        <div>{currItems.length}</div>
                    </div>
                )
            }, this);
        }
        this.props.setRepeates(repeates);
        this.setState({
            pesDom: pesDom
        })
    }

    render() {
        return (
            <div>
                <div className={`pes${this.props.result_show_mode === 'sorted_groups' ? ' grouped': ''}`} style={{ width: document.documentElement.clientWidth }}>
                    {this.state.pesDom}
                </div>
                <div>
                    Всего комбинаций: {this.props.pes_data_unsorted.length}
                </div>
            </div>
        );
    }    
}

export default SampleSpaces