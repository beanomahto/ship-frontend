import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Checkbox } from 'antd';
import useSignup from '../../hooks/useSignup';
import { useOrderContext } from '../../context/OrderContext';
import imgg from '../../utils/new.png';

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
  const [phoneError, setPhoneError] = useState('');

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^[0-9]{10}$/; 
    return phoneRegex.test(phoneNumber);
  };

  const handlePhoneNumberChange = (e) => {
    const { value } = e.target;
    setInputs({ ...inputs, phoneNumber: value });

    if (!validatePhoneNumber(value)) {
      setPhoneError('Please enter a valid 10-digit phone number.');
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phoneError) {
      return;
    }

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
                type='text'
                id='phoneNumber'
                placeholder='Phone No.'
                value={inputs.phoneNumber}
                onChange={handlePhoneNumberChange}
              />
              {phoneError && <span style={{ color: 'red' }}>{phoneError}</span>}
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
              <Checkbox
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                style={{ marginTop: '2rem', marginBottom: '1rem', marginLeft: '3rem' }}
              >
                I agree to the <a href='/terms-and-conditions' target='_blank' rel='noopener noreferrer'>Terms and Conditions</a>
              </Checkbox>
            </div>

            <div className="inputBx">
              <input type="submit" value='Signup' disabled={!agree || loading || phoneError} />
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
