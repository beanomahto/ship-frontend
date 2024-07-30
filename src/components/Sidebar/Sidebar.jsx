import React, { useState } from 'react'
import './sidebar.css'
import { Button, Layout, theme } from 'antd'
import Logo from './Logo';
import MenuList from './MenuList';
import ToggleButton from './ToggleButton';

const { Sider } = Layout;

const Sidebar = ({darktheme, toggleTheme}) => {
  
    const [collapsed, setCollapsed] = useState(false)

    
  return (
    <Layout className="sidebar">
        <Sider collapsed={collapsed}  onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)} collapsible trigger={null} theme={darktheme ? 'dark' : 'light'} className='side-items'>
            <Logo />
            <MenuList darktheme={darktheme} />
            <ToggleButton darktheme={darktheme} toggleTheme={toggleTheme} />
        </Sider>
    </Layout>
  )
}

export default Sidebar
