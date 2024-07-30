import React from 'react'
import { Button, Flex, Popover} from 'antd';
import './header.css'
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import useLogout from '../../hooks/useLogout';

const Header = ({darktheme}) => {
  const {authUser} = useAuthContext();
  console.log(authUser);
  const {loading, logout} = useLogout();
  return (
    <Flex className={darktheme ? 'darkHeader' : 'main-header'} vertical>
    <Flex gap='middle' justify='end' >
      {/* <Button className='btn' type='default' >Create Order</Button> */}
      {/* <span className='span' ></span> */}
      <Button className='money' type="default">	&#8377; {authUser?.amount}</Button>
      <span className='span'></span>
     {
      authUser ? <>

<Popover placement="bottomLeft" trigger={'click'} title={
            <div style={{
              display:'flex',
              flexDirection:"column",
              margin:'.5rem',
              gap:'1rem'
            }}>
              <Button><Link to='/profile' >Profile</Link></Button>
              <Button><Link to='/kyc' >KYC</Link></Button>
              <Button onClick={logout}>Logout</Button>
              {/* <button class="Btn" onClick={logout}>
  
  <div class="sign"><svg viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path></svg></div>
  
  <div class="logout">Logout</div>
</button> */}
          
            </div>
          }>
              <div className="Auth_Navbar">
      <div className="Symbol_logo_App">
        <p className="fstChar_logo_App">{authUser?.firstName?.charAt(0)}</p>
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
