import React, { Component } from 'react';
import { 
    Button,
    Popover,
} from 'antd';
import UserItem from './UserItem'

class GroupItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const {
            curr_group,
            tableData,
            groupData
        } = this.props;
        let group_users = []
        if(tableData && curr_group) 
            group_users = tableData[curr_group.id];

        return (
            <div className="group-wrap" key={curr_group.id}>
                <div className="group-data">
                    <div className="group-name">{curr_group.name === 'no_group' ? "Пользователи без группы" : curr_group.name}</div>
                    <div className="group-actions">
                        <Popover
                            placement="right"
                            content={() => this.props.renderNewGroupInputsPopover(curr_group)}
                            trigger="click"
                            visible={this.props.newGroupInputsVisible}
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