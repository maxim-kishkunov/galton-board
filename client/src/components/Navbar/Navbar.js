import React, { Component } from 'react';
import { Menu, Layout } from 'antd';
import Auth from '../auth/Auth'
import './Navbar.css';

const SubMenu = Menu.SubMenu;

const {
    Sider, Content,
} = Layout;

class NavbarMP extends Component {
    constructor(props){
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick = (e) => {
        if(e.key === "logout") {
            Auth.logOut();
        }
    }

    render() {
        return (
            <Layout className="home-page-layout-header" style={{ height:"100%",width:"100%"}}>
                <Content>
                    <div className="logo" />
                    <Menu
                        mode="horizontal"
                        theme="light"
                        className="main-horizontal-menu">
                        <Menu.Item
                            key='1'>
                        </Menu.Item>
                    </Menu>
                </Content>

                <Sider width={350}>
                    <Menu
                        onClick={this.handleClick}
                        selectedKeys={['']}
                        mode="horizontal">
                        <SubMenu  key="submenu-logout" title={JSON.parse(localStorage.currentUser).uid} >
                            <Menu.Item key="logout">Выйти</Menu.Item>
                        </SubMenu>
                    </Menu>
                </Sider>
            </Layout>
        );
    }
}

export default NavbarMP;