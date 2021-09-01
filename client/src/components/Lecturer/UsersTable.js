import axios from 'axios';
import React, { Component } from 'react';
import { 
    Button,
    Modal,
    Select,
    Input,
    Popover,
} from 'antd';
import { 
    PlusOutlined,
    CheckCircleOutlined,
} from '@ant-design/icons';
const Option = Select.Option;

class LecturerHomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: {},
            groupData: [],
        };
        this.getTableData = this.getTableData.bind(this);
        this.handleChangeText = this.handleChangeText.bind(this);
        this.newGroupChange = this.newGroupChange.bind(this);
        this.createNewStatus = this.createNewStatus.bind(this);
    }

    componentDidMount() {
        this.getTableData();
    }

    getTableData(){        
        axios.get(`/get_lect_data`).then(response => {
            if(response.data.code !== 200){
                Modal.error({
                    title: 'Error!',
                    content: response.data.message,
                });
            }else{
                this.setState({
                    tableData: response.data.data,
                    groupData: response.data.group_data
                })
            }
        })
    }

    handleChangeUserGroup(key, option){
        console.log(option);
        this.setState({
            userId: option.props.value,
        });
    }

    handleChangeText(event) {
        let fleldVal = event.target.value;
        let fleldName = event.target.name;

        this.setState({
            [fleldName]: fleldVal,
            modified: true
        });
    }

    renderNewGroupPopover = () => {
        return (
            <div style={{overflow: "auto", minWidth: '250px', display: 'flex'}}>
                <Input
                    style={{
                        width: '100%',
                        height: '32px',
                        fontSize: '12px',
                    }}
                    type="text"
                    name="newGroupName"
                    value={this.state.newGroupName}
                    onChange={this.handleChangeText}
                />
                <Button icon={<CheckCircleOutlined />} onClick={() => this.createNewStatus()} />
            </div>
        )
    }

    newGroupChange(visible){
        this.setState({
            newGroupVisible: visible
        })
    }

    createNewStatus() {
        this.setState({
            newStatusVisible: [],
        })
        let params = {
            name: this.state.newGroupName,
        };
        return axios.post(`/create_new_group`, params)
            .then(response => {
                this.getTableData();
            }).catch(error => {
                console.error(error);
            })
    }

    render() {
        return (
            <div className="users-table">
            { 
                Object.keys(this.state.tableData).length > 0 ? (
                    this.state.groupData.map(function (curr_group) {
                        let group_users = this.state.tableData[curr_group.id];
                        console.log(curr_group);
                        return (
                            <div className="group-wrap" key={curr_group.id}>
                                <div className="group-name">{curr_group.name === 'no_group' ? "Пользователи без группы" : curr_group.name}</div>
                                <div className="group-users">
                                {
                                    group_users && group_users.length > 0 ? (
                                        group_users.map(function (users_data) {
                                            return (
                                                <div className="user-wrap" key={users_data.user_id}>
                                                    <div className="user-name">{users_data.user_name}</div>
                                                    <div className="user-actions">
                                                        {
                                                            this.state.groupData.length > 1 ? (
                                                                <Select
                                                                    style={{ width: '100%' }}
                                                                    onChange={this.handleChangeUserGroup}
                                                                    showSearch
                                                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                                >
                                                                    {
                                                                        this.props.groupData && this.props.groupData.length ? 
                                                                            this.props.groupData.filter(item => item && item.name !== curr_group.name).map((select_group) => {
                                                                                return (
                                                                                    <Option key={select_group.id} value={select_group.id}>{select_group.name}</Option>
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
                                        }, this)
                                    ):('')
                                }
                                </div>
                            </div>
                        )
                    }, this)
                ):('')
            }
                <div className="group-add" key="new-group">
                    <Popover
                        placement="right"
                        content={this.renderNewGroupPopover()}
                        trigger="click"
                        onVisibleChange={this.newGroupChange}
                        visible={this.state.newGroupVisible}
                    >
                        <Button
                            className="action-panel-button"
                            icon={<PlusOutlined />}
                        >
                            Добавить группу
                        </Button>
                    </Popover>
                </div>
            </div>
        );
    }
}
export default LecturerHomePage;