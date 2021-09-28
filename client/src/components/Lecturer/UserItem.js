import React, { Component } from 'react';
import { 
    Popconfirm,
    Button,
} from 'antd';
import StackBarChart from '../../_helpers/StackBarChart';

import { 
    CrownOutlined,
} from '@ant-design/icons';

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
        } = this.props;
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
                    <div className="user-name">{user_data.user_name}{this.props.is_leader ? <CrownOutlined style={{color: '#eecf27'}} /> : ('')}</div>
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
                                bar_width={15}
                                chart_data={chartData}
                            />
                        ):('')
                    }
                    </div>
                    <div className="user-actions">
                        <Popconfirm 
                            title="Вы уверены, что хотите удалить этого пользователя?" 
                            onCancel={(e) => e.stopPropagation()} 
                            onConfirm={(e) => {
                                e.stopPropagation(); 
                                this.props.delete_user(user_data.user_id)
                            }}  
                            okText="OK" 
                            cancelText="Cancel"
                            placement="topRight"
                        >
                          <Button onClick={(e) => e.stopPropagation()} type="danger">Delete</Button>
                        </Popconfirm>
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