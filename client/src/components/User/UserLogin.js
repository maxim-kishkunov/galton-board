import axios from 'axios';
import { 
    Layout,
    Divider,
    Form,
    Row,
    Col,
    Typography,
    Input,
    Button,
 } from 'antd';
import React, { Component } from 'react';
import UserHomePage from './UserHomePage';

const { Text } = Typography;
const { Content } = Layout;
const uuidv4 = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
class UserLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isTokenActive: JSON.parse(localStorage.getItem('currentUser')) ? true : false,
            groupId: JSON.parse(localStorage.getItem('currentUser')) ? JSON.parse(localStorage.getItem('currentUser')).group_id : '',
            userId: JSON.parse(localStorage.getItem('currentUser')) ? JSON.parse(localStorage.getItem('currentUser')).user_id : '',
            name: ''
        };
        this.checkToken = this.checkToken.bind(this);
        this.handleChangeText = this.handleChangeText.bind(this);
    }

    componentDidMount() {
        // if(!this.state.isTokenActive)
            //this.checkToken();
    }

    handleChangeText(event) {
        let fleldName = event.target.name;
        let fleldVal = event.target.value;
        this.setState({
            [fleldName]: fleldVal,
        });
    }

    checkToken(){
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if(currentUser === null){
            axios.get(`/auth_by_token`,{params:{
                name: this.state.name,
                token: this.props.match.params.token
            }}).then(response => {
                if(response.data.code !== 200){

                }else{
                    localStorage.setItem('currentUser',
                        JSON.stringify({
                            user_id: response.data.user_data.id,
                            group_id: response.data.group_id,
                        })
                    )
                    this.setState({
                        isTokenActive: true,
                        userId: response.data.user_data.id,
                        groupId: response.data.group_id
                    })
                }
            })
        }
    }

    render () {

        return (
            this.state.isTokenActive ? (
                <UserHomePage {...this.props} group_id={this.state.groupId} />
            ):(
                <Layout 
                    className={`auth-page-layout`}
                    style={{
                        width: '100%',
                        height: '100%',
                        left: '0',
                        margin: '0'
                    }}
                >                  
                    <Content 
                        style={{ 
                            marginTop: '40px', 
                            width: '100%' , 
                            height: '100%' , 
                            position: 'absolute', 
                            alignItems: 'center',
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <div className="reg-form-wrap" style={{ width: window.innerWidth <= 1024 ? '100%' : '465px',}}>
                            <Divider style={{margin: 0}}>Авторизация</Divider>
                            <Form
                                className="login-form"
                                onSubmit={this.handleLogin}
                            >
                                <Row style ={{ textAlign: 'left'}}>
                                    <Col span={12}>
                                        <Text>Введите ваше имя</Text>
                                    </Col>
                                </Row>
                                <Form.Item style={{marginBottom: '0px'}} name="email" rules={[{ 
                                            required: true, 
                                            message: 'Введите имя' 
                                        }]}>
                                    <Input
                                        type="name"
                                        name="name"
                                        onChange={this.handleChangeText}/>
                                </Form.Item>
                                <Form.Item style={{marginTop: '20px', marginBottom: '0px'}}>
                                    <Button  style={{ width: '100%' }} type="primary"  htmlType="submit" onClick={this.checkToken}>OK</Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </Content>
                </Layout>
            )
        )
    }
}
export default UserLogin;