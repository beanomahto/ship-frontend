import React, { useState } from 'react';
// import './login.css';
import { Link, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("clicked");
        // if (newPassword !== confirmPassword) {
        //     alert("Passwords do not match");
        //     return;
        // }

        try {
            const response = await fetch('https://backend-9u5u.onrender.com/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    newPassword,
                    confirmPassword
                }),
            });
            console.log(email);
            console.log(newPassword);
            console.log(confirmPassword);
            console.log(response);
            const data = await response.json();
            console.log(data);
            if (response.ok) {
                alert("Password reset successfully");
                navigate('/login');
            } else {
                alert(data.error || "Something went wrong");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="mainConti">
                    <div className='container'>
                        <div className='header'>
                            <div className='text'>Reset Password</div>
                            <div className='underline'></div>
                        </div>
                        <div className='inputs'>
                            <div className='input'>
                                <input type="email" placeholder='email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className='input'>
                                <input type="password" placeholder='password'
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <div className='input'>
                                <input type="password" placeholder='confirm password'
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className='submit-container'>
                            <button className="submit">Save</button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default ResetPassword;
