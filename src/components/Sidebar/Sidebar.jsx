import React, { useState } from 'react';
import './sidebar.css';
import { Button, Layout, Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import Logo from './Logo';
import MenuList from './MenuList';

const { Sider } = Layout;

const Sidebar = ({ darktheme, toggleTheme }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  return (
    <Layout className="sidebar">
      <Button 
        className="hamburger-menu" 
        type="primary" 
        onClick={showDrawer} 
        icon={<MenuOutlined />}
        style={{ display: 'none' }}
      />

      <Sider
        collapsed={collapsed}
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => setCollapsed(true)}
        collapsible
        trigger={null}
        theme={darktheme ? 'dark' : 'light'}
        className="side-items"
      >
        <Logo />
        <MenuList darktheme={darktheme} />
        {/* <ToggleButton darktheme={darktheme} toggleTheme={toggleTheme} /> */}
      </Sider>

      <Drawer
        title="Menu"
        placement="left"
        onClose={closeDrawer}
        visible={drawerVisible}
        bodyStyle={{ padding: 0 }}
      >
        <Logo />
        <MenuList darktheme={darktheme} />
      </Drawer>
    </Layout>
  );
};

export default Sidebar;
