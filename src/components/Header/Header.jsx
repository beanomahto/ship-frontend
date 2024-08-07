import React from 'react'
import { Button, Flex, Input, Popover, Select, Space} from 'antd';
import './header.css'
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import useLogout from '../../hooks/useLogout';
const { Search } = Input;

const Header = ({darktheme}) => {
  const {authUser} = useAuthContext();
  console.log(authUser);
  const {loading, logout} = useLogout();
  const options = [
    {
      value: 'shipment',
      label: 'Shipment',
    },
    {
      value: 'orderId',
      label: 'OrderId',
    },
  ];
  return (
    <Flex className={darktheme ? 'darkHeader' : 'main-header'} vertical>
    <Flex gap='1.5rem' justify='end' align='center' >
      {/* <Button className='btn' type='default' >Track Order</Button> */}
      <Space.Compact>
      <Select defaultValue='shipment'  options={options} />
      <Search placeholder='Search AWB Number(s)' />
    </Space.Compact>
      <span className='span'></span>
      <Button className='money' type="default">	&#8377; {authUser?.amount}</Button>
      <span className='span'></span>
     {
      authUser ? <>

<Popover className='profile' placement="bottomLeft" trigger={'click'} title={
            <div style={{
              display:'flex',
              flexDirection:"column",
              margin:'.5rem',
              gap:'1rem'
            }}>
              <Button><Link to='/profile' >Profile</Link></Button>
              <Button><Link to='/kyc' >KYC</Link></Button>
              <Button onClick={logout}>Logout</Button>
            </div>
          }>
              <div className="Auth_Navbar">
      <div className="Symbol_logo_App">
        <p className="fstChar_logo_App">{authUser?.firstName?.charAt(0) + " "+authUser?.lastName?.charAt(0).toUpperCase() }</p>
      </div>
<Button type='text' className='name' >{authUser?.firstName +" "+ authUser?.lastName}</Button>
  </div>
        </Popover>
      </> : 
        <Button><Link to='/login' >Login</Link></Button>
     }
    </Flex>
  </Flex>
  )
}

export default Header
