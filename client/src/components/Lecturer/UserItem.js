import React, { Component } from 'react';
import { 
    Select,
} from 'antd';
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
            tableData,
            groupData
        } = this.props;
        let group_users = []
        if(tableData && curr_group) 
            group_users = tableData[curr_group.id];
        return (
            <div className="user-wrap" key={user_data.user_id}>
                <div className="user-name">{user_data.user_name}</div>
                <div className="user-actions">
                    {
                        groupData && groupData.length > 1 ? (
                            <Select
                                style={{ width: '100%' }}
                                onChange={this.props.handleChangeUserGroup}
                                showSearch
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                placeholder="Перенести в группу"
                            >
                                {
                                    groupData && groupData.length ? 
                                        groupData.filter(item => item && item.name !== curr_group.name).map((select_group) => {
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
    }
}
export default UserItem;