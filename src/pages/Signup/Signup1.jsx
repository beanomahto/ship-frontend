import React, { useState } from 'react';
// import './login1.css'; 
import { Link, useNavigate } from 'react-router-dom';
import { Checkbox } from 'antd';
import useSignup from '../../hooks/useSignup';
import { useOrderContext } from '../../context/OrderContext';
import imgg from '../../utils/onemore.png';
import gyb from '../../utils/gyb.mp4'
import vid1 from '../../utils/res.mp4'
const Signup1 = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    phoneNumber: '',
    password: '',
  });
  const [agree, setAgree] = useState(false);
  const { loading, signup } = useSignup();
  const { fetchOrders } = useOrderContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(inputs);
      fetchOrders();
      navigate('/');
    } catch (error) {
      console.error('Signup failed', error);
    }
  };

  return (
    <div className='section'>
      <div className='imgBx'>
        <img src={imgg} alt='Background' />
        {/* <video style={{height:'100%', width:'100%'}} autoPlay loop src={vid1}>
          <source src={vid1} type="video/mp4" />
        </video> */}
      </div>
      <div className='contentBx'>
        <div className="formBx">
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="inputBx">
              <label htmlFor="firstName">First Name</label>
              <input
                type='text'
                id='firstName'
                placeholder='First Name'
                value={inputs.firstName}
                onChange={(e) => setInputs({ ...inputs, firstName: e.target.value })}
              />
            </div>
            <div className="inputBx">
              <label htmlFor="lastName">Last Name</label>
              <input
                type='text'
                id='lastName'
                placeholder='Last Name'
                value={inputs.lastName}
                onChange={(e) => setInputs({ ...inputs, lastName: e.target.value })}
              />
            </div>
            <div className="inputBx">
              <label htmlFor="companyName">Company Name</label>
              <input
                type='text'
                id='companyName'
                placeholder='Company Name'
                value={inputs.companyName}
                onChange={(e) => setInputs({ ...inputs, companyName: e.target.value })}
              />
            </div>
            <div className="inputBx">
              <label htmlFor="email">Email</label>
              <input
                type='email'
                id='email'
                placeholder='Email'
                value={inputs.email}
                onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
              />
            </div>
            <div className="inputBx">
              <label htmlFor="phoneNumber">Phone No.</label>
              <input
                type='number'
                id='phoneNumber'
                placeholder='Phone No.'
                value={inputs.phoneNumber}
                onChange={(e) => setInputs({ ...inputs, phoneNumber: e.target.value })}
              />
            </div>
            <div className="inputBx">
              <label htmlFor="password">Password</label>
              <input
                type='password'
                id='password'
                placeholder='Password'
                value={inputs.password}
                onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
              />
            </div>
            <div className='terms'>
              <Checkbox checked={agree} onChange={(e) => setAgree(e.target.checked)} style={{marginTop:'2rem', marginBottom:'-1rem', marginLeft:'3rem'}}>
                I agree to the <a href='/terms-and-conditions' target='_blank' rel='noopener noreferrer'>Terms and Conditions</a>
              </Checkbox>
            </div>

            <div className="inputBx">
              <input type="submit" value='Signup' disabled={!agree || loading} />
            </div>
            <div className="inputBx">
              <p>Already have an account? <Link to='/login'>Click here!</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup1;
