import React, { Component } from 'react';
import { 
    Select,
} from 'antd';
import StackBarChart from '../../_helpers/StackBarChart';
const Option = Select.Option;

class UserItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const {
            curr_group,
            user_data,
            table_data,
            group_data
        } = this.props;
        let group_users = []
        if(table_data && curr_group) 
            group_users = table_data[curr_group.id];
        let chartData = [];
        let userPoints = 0;
        if(user_data.result_json && user_data.result_json.length > 0){
            let userResult = JSON.parse(user_data.result_json);
            for(let i = 0; i < user_data.drops_quantity; i++){
                let currKey = userResult[i];
                if(Object.keys(chartData).length > 0 && typeof chartData[currKey] !== 'undefined')
                    chartData[currKey] += 1;
                else
                    chartData[currKey] = 1;
            }
            userPoints = (chartData['-1'] ? chartData['-1'] : 0) + (chartData['0'] ? chartData['0'] : 0) + (chartData['1'] ? chartData['1'] : 0);
        }
        if(user_data && user_data.user_id){
            return (
                <div className="user-wrap" key={user_data.user_id}>
                    <div className="user-name">{user_data.user_name}</div>
                    <div className="user-result-points">
                    {
                        curr_group.name !== 'no_group' ? userPoints :('')
                    }
                    </div>
                    <div className="user-result-chart">
                    {
                        chartData.length > 0 ? (
                            <StackBarChart 
                                {...this.props}
                                size={user_data.board_length}
                                bar_height={2}
                                bar_width={20}
                                chart_data={chartData}
                            />
                        ):('')
                    }
                    </div>
                    <div className="user-actions">
                        {
                            group_data && group_data.length > 1 ? (
                                <Select
                                    style={{ width: '100%' }}
                                    onChange={this.props.handle_change_user_group}
                                    showSearch
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    placeholder="Перенести в группу"
                                >
                                    {
                                        group_data && group_data.length ? 
                                            group_data.filter(item => item && item.name !== curr_group.name).map((select_group) => {
                                                return (
                                                    <Option key={select_group.id} value={select_group.id} user_id={user_data.user_id}>{select_group.name}</Option>
                                                )
                                            }
                                        ) : ''
                                    }
                                </Select>
                            ):('')
                        }
                    </div>
                </div>
            )
        }else{
            return (
                <div className="user-wrap empty">&nbsp;</div>
            );
        }
    }
}
export default UserItem;