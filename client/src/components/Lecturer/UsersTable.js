import axios from 'axios';
import React, { Component } from 'react';
import { 
    Button,
    Modal,
    Select,
    Input,
    Popover,
    InputNumber,
    Form,
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
        this.handleChangeNumber = this.handleChangeNumber.bind(this);
        this.newGroupChange = this.newGroupChange.bind(this);
        this.createNewGroup = this.createNewGroup.bind(this);
        this.handleChangeUserGroup = this.handleChangeUserGroup.bind(this);
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
        let newGroupID = option.props.value;
        let userID = option.props.user_id;
        let params = {
            group_id: newGroupID,
            user_id: userID,
        };
        axios.post(`/change_user_group`, params).then(response => {
            this.getTableData();
        }).catch(error => {
            console.error(error);
        })
    }

    handleChangeText(event) {
        let fleldVal = event.target.value;
        let fleldName = event.target.name;

        this.setState({
            [fleldName]: fleldVal,
            modified: true
        });
    }

    newGroupChange(visible){
        this.setState({
            newGroupVisible: visible
        })
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
                <Button icon={<CheckCircleOutlined />} onClick={() => this.createNewGroup()} />
            </div>
        )
    }

    createNewGroup() {
        this.setState({
            newStatusVisible: [],
        })
        let params = {
            name: this.state.newGroupName,
        };
        axios.post(`/create_new_group`, params)
        .then(response => {
            this.getTableData();
        }).catch(error => {
            console.error(error);
        })
    }

    renderNewGroupInputsPopover = (groupData) => {
        const {
            group_id,
            input_json,
            drops_quantity,
            board_length,
        } = groupData;

        let jsonParsed = [];
        if(input_json && input_json.length > 0){
            let jsonArray = JSON.parse(input_json);
            for (let i = 1; i <= board_length; i++) {
                let row = [];
                for (let j = 0; j < drops_quantity; j++) {
                    row.push(
                        <td key={j}>{jsonArray[j][i]}</td>
                    )
                }
                jsonParsed.push(<tr key={i}>{row}</tr>);
            }
        }

        return (
            <div className="group-inputs" style={{overflow: "auto", minWidth: '250px', display: 'flex'}}>
                {
                    input_json && input_json.length > 0 ? (
                        <div>
                            <table className="inputs-table">
                                <tbody>
                                {
                                    jsonParsed
                                }
                                </tbody>
                            </table>
                        </div>
                    ):(
                        <div className="group-input-wrap">
                            <div className="controls">
                                <Form>
                                    <Form.Item  label="Размер доски" style={{marginBottom: '0px'}} name="board_length">
                                        <InputNumber
                                            style={{ width: 100, float: 'right' }}
                                            type="number"
                                            name="board_length"
                                            onChange={(value) => this.handleChangeNumber(group_id, value,'board_length')}/>
                                    </Form.Item>
                                    <Form.Item  label="Количество бросков" style={{marginBottom: '0px'}} name="drops_quantity">
                                        <InputNumber
                                            style={{ width: 100, float: 'right' }}
                                            type="number"
                                            name="drops_quantity"
                                            onChange={(value) => this.handleChangeNumber(group_id, value,'drops_quantity')}/>
                                    </Form.Item>
                                    <Form.Item style={{marginTop: '20px', marginBottom: '0px'}}>
                                        <Button  style={{ width: '100%' }} type="primary"  htmlType="submit" onClick={() => this.handleSubmit(group_id)}>OK</Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        </div>
                    )
                }
            </div>
        )
    }

    handleSubmit(group_id) {        
        let { groupData } = this.state;
        let currGroup = groupData.find(item => item && item.id === group_id);
        let params = {
            group_data: currGroup,
        };
        axios.post(`/create_group_input`, params)
        .then(response => {
            this.getTableData();
        }).catch(error => {
            console.error(error);
        })
    }

    handleChangeNumber(group_id, value, fieldName) {
        let { groupData } = this.state;
        let currGroup = groupData.find(item => item && item.id === group_id);
        currGroup[fieldName] = value;
        this.setState({
            groupData: groupData,
        });
    }

    render() {
        return (
            <div className="users-table">
            { 
                Object.keys(this.state.tableData).length > 0 ? (
                    this.state.groupData.map(function (curr_group) {
                        let group_users = this.state.tableData[curr_group.id];
                        return (
                            <div className="group-wrap" key={curr_group.id}>
                                <div className="group-data">
                                    <div className="group-name">{curr_group.name === 'no_group' ? "Пользователи без группы" : curr_group.name}</div>
                                    <div className="group-actions">
                                        <Popover
                                            placement="right"
                                            content={() => this.renderNewGroupInputsPopover(curr_group)}
                                            trigger="click"
                                            onVisibleChange={this.newGroupInputs}
                                            visible={this.state.newGroupInputsVisible}
                                        >
                                            <Button
                                                className="action-panel-button"
                                            >
                                                Исходные данные
                                            </Button>
                                        </Popover>
                                    </div>
                                </div>
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
                                                                    placeholder="Перенести в группу"
                                                                >
                                                                    {
                                                                        this.state.groupData && this.state.groupData.length ? 
                                                                            this.state.groupData.filter(item => item && item.name !== curr_group.name).map((select_group) => {
                                                                                return (
                                                                                    <Option key={select_group.id} value={select_group.id} user_id={users_data.user_id}>{select_group.name}</Option>
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