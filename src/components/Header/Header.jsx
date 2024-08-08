import React from 'react';
import { Button, Input, Popover, Select, Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import useLogout from '../../hooks/useLogout';
import './header.css';

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

  const onSearch = (value) => {
    const selectedOption = document.querySelector('.ant-select-selection-item')?.textContent.toLowerCase();
    if (selectedOption && value) {
      navigate(`/tracking/${selectedOption}/${value}`);
    }
  };

  return (
    <div className={darktheme ? 'darkHeader' : 'main-header'}>
      <div className="header-container" style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', gap: '1.5rem' }}>
        <Space.Compact>
          <Select defaultValue='shipment' options={options} />
          <Search placeholder='Search AWB Number(s)' onSearch={onSearch} />
        </Space.Compact>
        <span className='span'></span>
        <Button className='money' type="default">&#8377; {authUser?.amount}</Button>
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
