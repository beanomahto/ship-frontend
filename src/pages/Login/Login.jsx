
import React, { useState } from 'react'
import './login.css'
import email_icon from './email.png'
import password_icon from './password.png'
import {Link, useNavigate} from 'react-router-dom'
import useLogin from '../../hooks/useLogin'

const Login = () => {
    // example@mail.com
    // 1234567890
    const navigate = useNavigate()
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const { loading, login } = useLogin();

	const handleSubmit = async (e) => {
		e.preventDefault();
        console.log(email, password);
		await login(email, password);
        navigate('/')
	};
  return (
   <form onSubmit={handleSubmit}>
     <div className='container'>
        <div className='header'>
            <div className='text'>Login</div>
            <div className='underline'></div>
        </div>
        <div className='inputs'>
            <div className='input'>
                <img src={email_icon} alt='' />
                <input type="email" placeholder='email' 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className='input'>
                <img src={password_icon} alt='' />
                <input type="password" placeholder='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>
        </div>
   <div className='forgot-password'>Dont have an account ? <Link to='/signup'><span>Click here!</span></Link></div>
        <div className='submit-container'>
            <button className="submit">Login</button>
        </div>
    </div>
   </form>
  )
}

export default Login
