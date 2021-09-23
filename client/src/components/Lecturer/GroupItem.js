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
        let group_users = []
        if(table_data && curr_group) 
            group_users = table_data[curr_group.id];

        return (
            <div className="group-wrap" key={curr_group.id}>
                <div className="group-data">
                    <div className="group-name">{curr_group.name === 'no_group' ? "Пользователи без группы" : curr_group.name}</div>
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
                </div>
            </div>
        )
    }
}
export default GroupItem;