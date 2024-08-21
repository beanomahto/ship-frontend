import React, { useState, useEffect } from 'react';
import './profile.css';
import { useAuthContext } from '../../context/AuthContext';
import { Helmet } from 'react-helmet';
import pincodeData from '../../utils/zones.json';

const Profile = () => {
    const { authUser } = useAuthContext();
    const [inputs, setInputs] = useState({
        brandName: '',
        website: '',
        address: '',
        pincode: '',
        city: '',
        state: '',
        country: ''
    });

    const title = 'User Profile';

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('https://backend-9u5u.onrender.com/api/users/me', {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    },
                });
                const data = await response.json();
                console.log(data);
                
                setInputs({
                    brandName: data.brandName || '',
                    website: data.website || '',
                    address: data.address || '',
                    pincode: data.pincode || '',
                    city: data.city || '',
                    state: data.state || '',
                    country: data.country || ''
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handlePincodeChange = (e) => {
        const enteredPincode = e.target.value;
        setInputs({ ...inputs, pincode: enteredPincode });

        const matchedData = pincodeData.find(item => item.Pincode.toString() === enteredPincode);
        if (matchedData) {
            setInputs({
                ...inputs,
                pincode: enteredPincode,
                city: matchedData.City,
                state: matchedData.StateName
            });
        } else {
            setInputs({
                ...inputs,
                pincode: enteredPincode,
                city: '',
                state: ''
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs({ ...inputs, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://backend-9u5u.onrender.com/api/users/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('token'),
                },
                body: JSON.stringify(inputs)
            });
            console.log(response);
            
            if (response.ok) {
                alert('Profile updated successfully!');
            } else {
                alert('Failed to update profile.');
            }
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    return (
        <div className='formCon'>
            <Helmet>
                <meta charSet='utf-8' />
                <meta name='description' content='' />
                <title>{title}</title>
            </Helmet>
            <form className="form" onSubmit={handleSubmit}>
                <p className="title">Profile</p>
                <div className='flex1'>
                    <div className="flex">
                        <label>
                            <span>Register Company Name</span>
                            <input
                                className="input"
                                type="text"
                                name="companyName"
                                placeholder=""
                                value={authUser.companyName}
                                // onChange={handleChange}
                            />
                        </label>
                        <label>
                            <span>Company Email ID</span>
                            <input
                                className="input"
                                type="email"
                                name="email"
                                placeholder=""
                                value={authUser.email}
                                // onChange={handleChange}
                            />
                        </label>
                        <div className='picc'>
                            <label>
                                <span>Company Logo<span><p>(optional)</p></span></span>
                                <img
                                    className='input img'
                                    // src={inputs.logo}
                                    alt="Company Logo"
                                />
                            </label>
                        </div>
                    </div>
                    <div className="flex">
                        <label className='bn'>
                            <span>Brand Name<span><p>(optional)</p></span></span>
                            <input
                                className="input"
                                type="text"
                                name="brandName"
                                placeholder=""
                                value={inputs.brandName}
                                onChange={handleChange}
                            />
                        </label>
                        <label className='bn'>
                            <span>Website <span><p>(optional)</p></span></span>
                            <input
                                className="input"
                                type="text"
                                name="website"
                                placeholder=""
                                value={inputs.website}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                </div>
                <div className='flex2'>
                    <div className="flex">
                        <label>
                            <span>Complete address</span>
                            <input
                                className="input add"
                                type="text"
                                name="address"
                                placeholder=""
                                value={inputs.address}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            <span>Pincode</span>
                            <input
                                className="input"
                                type="text"
                                name="pincode"
                                placeholder=""
                                value={inputs.pincode}
                                onChange={handlePincodeChange}
                            />
                        </label>
                    </div>
                    <div className="flex">
                        <label>
                            <span>City</span>
                            <input
                                className="input"
                                type="text"
                                name="city"
                                placeholder=""
                                value={inputs.city}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            <span>State</span>
                            <input
                                className="input"
                                type="text"
                                name="state"
                                placeholder=""
                                value={inputs.state}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            <span>Country</span>
                            <input
                                className="input"
                                type="text"
                                name="country"
                                placeholder=""
                                value={inputs.country}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                </div>
                <button className="submit" type="submit">Save</button>
            </form>
        </div>
    );
};

export default Profile;
