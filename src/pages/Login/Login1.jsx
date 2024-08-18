import React, { useState } from 'react';
import './login1.css';
import imgg from '../../utils/rmdb.png';
import { Link, useNavigate } from 'react-router-dom';
import useLogin from '../../hooks/useLogin'; 
import { useOrderContext } from '../../context/OrderContext';
import ForgotPasswordModal from './ForgotPasswordModal';
import gyb from '../../utils/gyb.mp4'
import vid1 from '../../utils/res.mp4'
const Login1 = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false); 

  const { loading, login } = useLogin();
  const { fetchOrders } = useOrderContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      fetchOrders();
      navigate('/');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <>
      <div className='section'>
        <div className='imgBx'>
        <video style={{height:'100%', width:'100%'}} autoPlay loop src={vid1}>
          <source src={vid1} type="video/mp4" />
        </video>
        </div>
        <div className='contentBx'>
          <div className="formBx">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="inputBx">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="inputBx">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {/* <div className="remember">
                <label>
                  <input type="checkbox" id="remember" name="remember" />
                  Remember
                </label>
              </div> */}
              <div className="inputBx">
                <input type="submit" value='Login' />
              </div>
              <div className="inputBx">
                <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
              </div>
              <div className="inputBx">
                Forgot Password? <span onClick={() => setIsModalVisible(true)} style={{cursor:'pointer'}}>Click here!</span>
              </div>
            </form>
          </div>
        </div>
      </div>

      <ForgotPasswordModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </>
  );
};

export default Login1;
