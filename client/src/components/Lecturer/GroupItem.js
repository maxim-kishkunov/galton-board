import React, { Component } from 'react';
import { 
    Button,
    Popover,
    Input,
} from 'antd';
import UserItem from './UserItem'
import {
    CopyOutlined,
} from '@ant-design/icons';
import { serverLink } from '../../_helpers/const'


class GroupItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    renderInvitePopover(curr_group){
        return (
            <div style={{overflow: "auto", minWidth: '300px', display: 'flex'}}>
                <Input
                    style={{
                        width: '100%',
                        height: '32px',
                        fontSize: '12px',
                        textAlign: 'center'
                    }}
                    type="text"
                    name="inviteLink"
                    value={`${serverLink}/group/${curr_group.invite_token}`}
                />
                {/* <Button icon={<CopyOutlined />} onClick={() => {}} /> */}
            </div>
        )
    }

    render() {
        const {
            curr_group,
            table_data,
            group_data
        } = this.props;
        let group_users = [];
        if(table_data && curr_group) 
            group_users = table_data[curr_group.id];

        let groupDate = '';
        if(curr_group.created_at){
            let date_created = new Date(curr_group.created_at);
            groupDate = ("0" + date_created.getDate()).slice(-2) + "-" + 
                        ("0" + (date_created.getMonth()+1)).slice(-2) + "-" + date_created.getFullYear() + " " + 
                        ("0" + date_created.getHours()).slice(-2) + ":" + ("0" + date_created.getMinutes()).slice(-2);
        }

        let statMethodResult = [];
        let initialResult = [];
        let drops_quantity = 0;
        let board_length = 0;
        
        if(curr_group.drops_quantity && typeof curr_group.drops_quantity !== 'undefined'){
            drops_quantity = curr_group.drops_quantity;
            board_length = curr_group.board_length;
        }
        if(curr_group.initialResult && curr_group.initialResult.length > 0){
            initialResult = JSON.parse(curr_group.initialResult);
            let partSum = 0;
            let correction = 0;
            for(let i = 0; i < curr_group.drops_quantity; i++){
                let currKey = initialResult[i];
                partSum += currKey;
                if(i % 5 === 0 && i > 0){
                    correction = -1 * Math.round((correction + partSum) / 5);
                    partSum = 0;
                }
                statMethodResult.push(currKey + correction);
            }
        }
        return (
            <div className="group-wrap" key={curr_group.id}>
                <div className="group-data">
                    <div className="group-name">{curr_group.name === 'no_group' ? "Пользователи без группы" : curr_group.name}</div>
                    {
                        curr_group.name !== 'no_group' && typeof curr_group.random_shift !== 'undefined' ? (
                            <div className="group-date">{groupDate}</div>
                        ):('')
                    }
                    {
                        curr_group.name !== 'no_group' && typeof curr_group.random_shift !== 'undefined' ? (
                            <div className="group-chars">
                                <div className="char-wrap">
                                {
                                    typeof curr_group.random_shift === 'number' ? 
                                        `Смещение: ` + curr_group.random_shift 
                                    : ''
                                }
                                </div>
                            </div>
                        ):('')
                    }
                    <div className="group-actions">
                        <Popover
                            placement="right"
                            content={() => this.renderInvitePopover(curr_group)}
                            trigger="click"
                            visible={this.props.new_group_inputs_visible}
                        >
                            {
                                curr_group.name !== 'no_group' &&
                                    <Button
                                        className="action-panel-button"
                                    >
                                        Приглашение
                                    </Button>
                            }      
                        </Popover>
                        <Popover
                            placement="right"
                            content={() => this.props.render_new_group_inputs_popover(curr_group)}
                            trigger="click"
                            visible={this.props.new_group_inputs_visible}
                        >
                            {
                                curr_group.name !== 'no_group' &&
                                    <Button
                                        className="action-panel-button"
                                    >
                                        Исходные данные
                                    </Button>
                            }      
                        </Popover>
                    </div>
                </div>
                <div className="group-users">
                {
                    initialResult.length > 0 ? (
                        <UserItem
                            {...this.props}
                            key="initial_user"
                            user_data={{
                                user_id: 'initial',
                                user_name: 'Начальные данные',
                                drops_quantity: drops_quantity,
                                board_length: board_length,
                                result_json: JSON.stringify(initialResult),
                            }}
                        />
                    ):('')
                }
                {
                    group_users && group_users.length > 0 ? (
                        group_users.map(function (user_data) {
                            return (
                                <UserItem
                                    {...this.props}
                                    key={user_data.user_id}
                                    user_data={user_data}
                                />
                            )
                        }, this)
                    ):('')
                }
                {
                    statMethodResult.length > 0 ? (
                        <UserItem
                            {...this.props}
                            key="stat_method_user"
                            user_data={{
                                user_id: 'stat_method',
                                user_name: 'Static Process Control',
                                drops_quantity: drops_quantity,
                                board_length: board_length,
                                result_json: JSON.stringify(statMethodResult),
                            }}
                        />
                    ):('')
                }
                </div>
            </div>
        )
    }
}
export default GroupItem;