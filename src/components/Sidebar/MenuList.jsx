import React from 'react'
import { Menu } from 'antd'
import { HomeOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { LuLayoutDashboard, LuWarehouse } from "react-icons/lu";
import { IoCartOutline, IoFileTrayFullOutline  } from "react-icons/io5";
import { MdOutlineIntegrationInstructions } from "react-icons/md";
import { CiSettings } from "react-icons/ci";
import { FaRegAddressCard, FaTools  } from "react-icons/fa";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { MdMoney } from "react-icons/md";
import { TbReportSearch } from "react-icons/tb";
import { Link } from 'react-router-dom'

const MenuList = ({darktheme}) => {
    return (
        <Menu theme={darktheme ? 'dark' : 'light' } mode='inline' className='menu-bar'>
            <Menu.Item key='home' icon={<LuLayoutDashboard />} >
                <Link to='/dashboard'>Dashboard</Link>
            </Menu.Item>
            <Menu.Item key='orders' icon={<ShoppingCartOutlined />} >
                <Link to='/orders'>Orders</Link>
            </Menu.Item>
           
            <Menu.Item key='ndr' icon={<IoFileTrayFullOutline />} >
            <Link to='/ndr'>NDR</Link>
            </Menu.Item>

            <Menu.SubMenu key='finance' title='Finance' icon={<MdMoney />} >
                <Menu.Item key='cod_remittance'  ><Link to='finance/codremmitance' >COD Remittance</Link></Menu.Item>
                <Menu.Item key='wallet'  ><Link to='finance/wallet' >Wallet</Link></Menu.Item>
                {/* <Menu.Item key='walletAdmin'  ><Link to='finance/walletadmin' >Wallet Admin</Link></Menu.Item> */}
                <Menu.Item key='rateShipping'  >Rate Shipping</Menu.Item>
                <Menu.Item key='pricing'  ><Link to='finance/pricing' >Pricing</Link></Menu.Item>
                <Menu.Item key='weightDiscrepancies'  ><Link to='finance/weight_discrepancies'>Weight Discrepancies</Link></Menu.Item>
                <Menu.Item key='invoices'  ><Link to='finance/invoices' >Invoices</Link></Menu.Item>
            </Menu.SubMenu>
            <Menu.Item key='warehouse' icon={<LuWarehouse />} >
            <Link to='/warehouse'>Warehouse</Link>
            </Menu.Item>
            <Menu.Item key='rate_card' icon={<LiaRupeeSignSolid size='1.5rem' />} >
            <Link to='/ratecard' >Rate Card</Link>
            </Menu.Item>
            <Menu.SubMenu key='tool' title='Tool' icon={<FaTools  />} >
                <Menu.Item key='rateCalculator' ><Link to='/ratecalculator' >Rate Calculator</Link></Menu.Item>
                <Menu.Item key='label' ><Link to='/label'>Label</Link></Menu.Item>
                <Menu.Item key='updLabel' ><Link to='/updatelabel'>UpdateLabel</Link></Menu.Item>
                <Menu.Item key='pcServiceability' >
                    <Link to='/pincodeservice' >Pin Code Serviceablity</Link></Menu.Item>
                <Menu.Item key='channelIntegration' >
                    <Link to='/channelintegration' >Channel Integration</Link></Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key='reports' title='Reports' icon={<TbReportSearch  />} >
                <Menu.Item key='misReport' >
                    <Link to='reports/misreport' >Master MIS Report</Link></Menu.Item>
                <Menu.Item key='ndrReport' >
                    <Link  >NDR Report</Link></Menu.Item>
            </Menu.SubMenu>
            <Menu.Item key='setting' icon={<CiSettings size='1.5rem' />} >
                Setting
            </Menu.Item>
        </Menu>
    )
}

export default MenuList
