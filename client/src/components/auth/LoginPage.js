import React from 'react';
import axios from 'axios';
import Icon from '@ant-design/icons';
import { Input, Button, Col, Row, Typography, Layout, Modal, Form, Divider } from "antd";
import Auth from '../auth/Auth'

const { Text } = Typography;
const { Content } = Layout;

class LoginPage extends React.Component {

    constructor(props) {
        super(props)
        this.state = { 
            email: "",
            password: "",
        };
        this.handleLogin = this.handleLogin.bind(this);
        this.handleChangeText = this.handleChangeText.bind(this);
    }

    handleLogin(e){
        e.preventDefault();        
        axios.get(`http://172.30.222.45:84/auth`,{params: 
            {
                email: this.state.email,
                password: this.state.password
            }}
        ).then(response => {
            if(response.data.code !== 200){
                Modal.error({
                    title: 'Error!',
                    content: response.data.message,
                });
            }else{
                localStorage.setItem('role', response.data.role_id );
                localStorage.setItem('currentUser',
                    JSON.stringify({
                        user_id: response.data.user_id,
                        user_email: response.data.user_email,
                    })
                );
                window.location.replace('/');
            }
        }).catch(function (error) {
            if (error.response && error.response.status === 401) {
                Auth.logOut();
            }
            Modal.error({
                title: 'Подтвердите действие',
                content: 'Неверная учетная запись или пароль!',
            });
        });
    }

    handleChangeText(event) {
        let fleldName = event.target.name;
        let fleldVal = event.target.value;
        this.setState({
            [fleldName]: fleldVal,
        });
    }

    render () {

        return (
            <Layout 
                className={`auth-page-layout ${this.props.dark_theme === 'true' ? ' dark' : ''}`}
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
                                    <Text>E-mail</Text>
                                </Col>
                            </Row>
                            <Form.Item style={{marginBottom: '0px'}} name="email" rules={[{ 
                                        required: true, 
                                        message: 'Введите e-mail!' 
                                    }]}>
                                <Input
                                    type="email"
                                    name="email"
                                    onChange={this.handleChangeText}/>
                            </Form.Item>
                            <Row style ={{ textAlign: 'left'}}>
                                <Col span={12}>
                                    <Text>Пароль</Text>
                                </Col>
                            </Row>
                            <Form.Item style={{marginBottom: '0px'}} name="password" rules={[{ 
                                        required: true, 
                                        message: 'Введите пароль!' 
                                    }]}>
                                <Input
                                    type="password"
                                    name="password"
                                    prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)' }} />}
                                    onChange={this.handleChangeText}/>
                            </Form.Item>                            
                            <Form.Item style={{marginTop: '20px', marginBottom: '0px'}}>
                                <Button  style={{ width: '100%' }} type="primary"  htmlType="submit" onClick={this.handleLogin}>OK</Button>
                            </Form.Item>
                            <a className="login-form-forgot" href="/sign_up" style={{width: '100%', display: 'block', textAlign: 'right'}}>Регистрация</a>
                        </Form>
                    </div>
                </Content>
            </Layout>
        )
    }
}
export default LoginPage;