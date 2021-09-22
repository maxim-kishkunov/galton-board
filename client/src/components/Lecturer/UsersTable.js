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
import GroupItem from './GroupItem'

const Option = Select.Option;

class UsersTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: {},
            groupData: [],
            inviteModalVisible: false,
        };
        this.getTableData = this.getTableData.bind(this);
        this.handleChangeText = this.handleChangeText.bind(this);
        this.handleChangeNumber = this.handleChangeNumber.bind(this);
        this.newGroupChange = this.newGroupChange.bind(this);
        this.createNewGroup = this.createNewGroup.bind(this);
        this.handleChangeUserGroup = this.handleChangeUserGroup.bind(this);
        this.getInviteLink = this.getInviteLink.bind(this);
    }

    componentDidMount() {
        this.getTableData();
    }

    getTableData(){        
        axios.get(`/get_lect_data`).then(response => {
            if(response.data.code !== 200){
                // Modal.error({
                //     title: 'Error!',
                //     content: response.data.message,
                // });
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
            id,
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
                                            onChange={(value) => this.handleChangeNumber(id, value,'board_length')}/>
                                    </Form.Item>
                                    <Form.Item  label="Количество бросков" style={{marginBottom: '0px'}} name="drops_quantity">
                                        <InputNumber
                                            style={{ width: 100, float: 'right' }}
                                            type="number"
                                            name="drops_quantity"
                                            onChange={(value) => this.handleChangeNumber(id, value,'drops_quantity')}/>
                                    </Form.Item>
                                    <Form.Item style={{marginTop: '20px', marginBottom: '0px'}}>
                                        <Button  style={{ width: '100%' }} type="primary"  htmlType="submit" onClick={() => this.handleSubmit(id)}>OK</Button>
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

    getInviteLink(group_id){    
        // axios.get(`/get_invite_link`,{params: 
        //     {
        //         group_id: currentUser.user_id
        //     }}
        // ).then(response => {
        //     if(response.data.code !== 200){
        //         Modal.error({
        //             title: 'Error!',
        //             content: response.data.message,
        //         });
        //     }else{
        //         this.setState({
        //             tableData: response.data.data,
        //             groupData: response.data.group_data
        //         })
        //     }
        // })
    }

    toggleInviteModal(group_id){
        if(!this.state.inviteModalVisible){
            this.getInviteLink(group_id);
        }
        this.setState({
            inviteModalVisible: !this.state.inviteModalVisible,
        })
    }

    render() {
        return (
            <div className="users-table">
                <div className="header-wrap">
                    <div className="name">ФИО пользователя</div>
                    <div className="result-points">Количество попаданий</div>
                    <div className="result-chart">Гистрограмма по результатам</div>
                    <div className="actions">Действия</div>
                </div>
                { 
                    Object.keys(this.state.tableData).length > 0 ? (
                        this.state.groupData.map(function (curr_group) {
                            return(
                                <GroupItem 
                                    {...this.props}
                                    key={curr_group.id}
                                    curr_group={curr_group}
                                    table_data={this.state.tableData}
                                    new_group_inputs_visible={this.state.newGroupInputsVisible}
                                    group_data={this.state.groupData}
                                    handle_change_user_group={this.handleChangeUserGroup}
                                    render_group_invite_popover={this.renderGroupInvite_popover}
                                    render_new_group_inputs_popover={this.renderNewGroupInputsPopover}
                                />
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
export default UsersTable;