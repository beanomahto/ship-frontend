import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Checkbox, Button, Input } from 'antd';
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
    otp: '', 
  });
  console.log(inputs);
  
  const [otpArray, setOtpArray] = useState(new Array(6).fill('')); 
  const [agree, setAgree] = useState(false);
  const { loading, signup } = useSignup();
  const { fetchOrders } = useOrderContext();
  const [phoneError, setPhoneError] = useState('');
  const [isOtpButtonDisabled, setIsOtpButtonDisabled] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);

  const otpRefs = useRef(new Array(6).fill(null)); 

  const validatePhoneNumber = (phoneNumber) => /^[0-9]{10}$/.test(phoneNumber);

  const handlePhoneNumberChange = (e) => {
    const { value } = e.target;
    setInputs({ ...inputs, phoneNumber: value });
    if (!validatePhoneNumber(value)) {
      setPhoneError('Please enter a valid 10-digit phone number.');
    } else {
      setPhoneError('');
    }
  };

  const handleOTPChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value)) {
      const newOtpArray = [...otpArray];
      newOtpArray[index] = value;
      setOtpArray(newOtpArray);
      setInputs({ ...inputs, otp: newOtpArray.join('') }); 
      
      if (index < 5 && value) {
        otpRefs.current[index + 1].focus();
      }
    }
  };

  const handleOTPKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      const newOtpArray = [...otpArray];
      
      // If the current input is empty, focus on the previous input
      if (!otpArray[index] && index > 0) {
        otpRefs.current[index - 1].focus();
      }
      
      // Clear the current input if Backspace is pressed
      newOtpArray[index] = '';
      setOtpArray(newOtpArray);
      setInputs({ ...inputs, otp: newOtpArray.join('') });
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

  const handleSendOtp = async () => {
    if (inputs.email) {
      try {
        const response = await fetch('https://backend.shiphere.in/api/auth/sendOtp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: inputs.email, // Send the email for OTP generation
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to send OTP');
        }
  
        const result = await response.json();
        console.log('OTP sent successfully:', result);
  
        // Start the OTP timer after the OTP is sent
        setIsOtpButtonDisabled(true);
        let timeLeft = 30;
        setOtpTimer(timeLeft);
  
        const timerInterval = setInterval(() => {
          timeLeft -= 1;
          setOtpTimer(timeLeft);
  
          if (timeLeft === 0) {
            setIsOtpButtonDisabled(false);
            clearInterval(timerInterval);
          }
        }, 1000);
      } catch (error) {
        console.error('Error sending OTP:', error);
      }
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

            <div className="otpSection">
              <Button 
                onClick={handleSendOtp} 
                disabled={!inputs.email || isOtpButtonDisabled} 
                type="primary"
              >
                {isOtpButtonDisabled ? `Resend OTP in ${otpTimer}s` : 'Send OTP'}
              </Button>
              <div className="otpContainer">
                {otpArray.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)} 
                    value={digit}
                    onChange={(e) => handleOTPChange(e, index)}
                    onKeyDown={(e) => handleOTPKeyDown(e, index)}
                    maxLength={1}
                    className="otpBox"
                  />
                ))}
              </div>
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
