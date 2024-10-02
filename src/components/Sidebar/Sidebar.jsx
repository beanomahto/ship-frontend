import React, { useState, useEffect } from 'react';
import './sidebar.css';
import { Button, Layout, Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import Logo from './Logo';
import MenuList from './MenuList';

const { Sider } = Layout;

const Sidebar = ({ darktheme, toggleTheme }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768); 
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize(); 
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Layout className="sidebar">
      {isMobile ? (
        <>
          <Button
            className="hamburger-menu"
            type="primary"
            onClick={showDrawer}
            icon={<MenuOutlined />}
          />

          {/* Drawer for mobile view */}
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
        </>
      ) : (
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
        </Sider>
      )}
    </Layout>
  );
};

export default Sidebar;
