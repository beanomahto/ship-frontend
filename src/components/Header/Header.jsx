import React from 'react';
import { Button, Input, Popover, Select, Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import useLogout from '../../hooks/useLogout';
import './header.css';
import { useOrderContext } from '../../context/OrderContext';

const { Search } = Input;

const Header = ({ darktheme }) => {
  const { authUser } = useAuthContext();
  const { loading, logout } = useLogout();
  const navigate = useNavigate();

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

  const {orders} = useOrderContext();


  const kookok = orders?.orders?.filter((awb) => awb?.awb === "7D5681702")
  console.log(kookok);
  
const amount = parseFloat(authUser?.amount.toFixed(2))
const onSearch = (awb) => {
  console.log(awb);
    
  const selectedOption = document.querySelector('.ant-select-selection-item')?.textContent.toLowerCase();
  
  const filteredOrder = orders?.orders?.filter((order) => order?.awb === awb);

  console.log(filteredOrder);
  
  if (selectedOption && filteredOrder.length > 0) {
    const shippingPartner = filteredOrder[0]?.shippingPartner; 

    if (shippingPartner) {
      navigate(`/tracking/${selectedOption}/${shippingPartner}/${awb}`);
    } else {
      console.log('No shipping partner found for the matching order');
    }
  } else {
    console.log('No matching order found');
  }
};

  https://backend.shiphere.in/api/${shippingPartner}/track/${awb}
  return (
    <div className={darktheme ? 'darkHeader' : 'main-header'}>
      <div className="header-container" style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', gap: '1.5rem' }}>
        <div className="header-search">
        <Space.Compact>
          <Select defaultValue='shipment' options={options} />
          <Search placeholder='Search AWB Number(s)' onSearch={onSearch} />
        </Space.Compact>
        </div>
        <span className='span'></span>
        <Button className='money' type="default">&#8377;  {amount}</Button>
        <span className='span'></span>
        {authUser ? (
          <>
            <Popover
              className='profile'
              placement="bottomLeft"
              trigger={'click'}
              title={
                <div style={{
                  display: 'flex',
                  flexDirection: "column",
                  margin: '.5rem',
                  gap: '1rem'
                }}>
                  <Button><Link to='/profile'>Profile</Link></Button>
                  <Button><Link to='/kyc'>KYC</Link></Button>
                  <Button onClick={logout}>Logout</Button>
                </div>
              }
            >
              <div className="Auth_Navbar">
                <div className="Symbol_logo_App">
                  <p className="fstChar_logo_App">
                    {authUser?.firstName?.charAt(0).toUpperCase() + " " + authUser?.lastName?.charAt(0).toUpperCase()}
                  </p>
                </div>
                <Button type='text' className='name'>
                  {authUser?.firstName + " " + authUser?.lastName}
                </Button>
              </div>
            </Popover>
          </>
        ) : (
          <Button><Link to='/login'>Login</Link></Button>
        )}
      </div>
    </div>
  );
};

export default Header;
