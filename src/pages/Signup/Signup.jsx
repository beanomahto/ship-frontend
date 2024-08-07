import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Checkbox } from 'antd';
import useSignup from '../../hooks/useSignup';

const Signup = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputs);
    await signup(inputs);
    navigate('/');
  };

  return (
    <div className='mainConti'>
      <form onSubmit={handleSubmit}>
        <div className='container'>
          <div className='header'>
            <div className='text'>Sign Up</div>
            <div className='underline'></div>
          </div>
          <div className='inputs'>
            <div className='input'>
              <img src='' alt='' />
              <input
                type='text'
                placeholder='First Name'
                value={inputs.firstName}
                onChange={(e) => setInputs({ ...inputs, firstName: e.target.value })}
              />
            </div>
            <div className='input'>
              <img src='' alt='' />
              <input
                type='text'
                placeholder='Last Name'
                value={inputs.lastName}
                onChange={(e) => setInputs({ ...inputs, lastName: e.target.value })}
              />
            </div>
            <div className='input'>
              <img src='' alt='' />
              <input
                type='text'
                placeholder='Company Name'
                value={inputs.companyName}
                onChange={(e) => setInputs({ ...inputs, companyName: e.target.value })}
              />
            </div>
            <div className='input'>
              <img src='' alt='' />
              <input
                type='mail'
                placeholder='Email'
                value={inputs.email}
                onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
              />
            </div>
            <div className='input'>
              <img src='' alt='' />
              <input
                type='number'
                placeholder='Phone No.'
                value={inputs.phoneNumber}
                onChange={(e) => setInputs({ ...inputs, phoneNumber: e.target.value })}
              />
            </div>
            <div className='input'>
              <img src='' alt='' />
              <input
                type='password'
                placeholder='Password'
                value={inputs.password}
                onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
              />
            </div>
          </div>
          <div className='terms'>
            <Checkbox checked={agree} onChange={(e) => setAgree(e.target.checked)} style={{marginTop:'2rem', marginBottom:'-1rem', marginLeft:'3rem'}} >
              I agree to the <a href='/terms-and-conditions' target='_blank' rel='noopener noreferrer'>Terms and Conditions</a>
            </Checkbox>
          </div>
          <div className='forgot-password'>
            Already have an account? <Link to='/login'><span>Click here!</span></Link>
          </div>
          <div className='submit-container'>
            <button className='submit' type='submit' disabled={!agree || loading}>
              Signup
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Signup;
