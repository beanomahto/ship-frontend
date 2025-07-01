import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAuthContext } from '../../context/AuthContext';
import pincodeData from '../../utils/zones.json';
import './profile.css';

const Profile = () => {
    const { authUser } = useAuthContext();
    const [inputs, setInputs] = useState({
        brandName: '',
        website: '',
        address: '',
        pincode: '',
        city: '',
        state: '',
        country: '',
        logo: null,
    });

    const title = 'User Profile';

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/users/me', {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    },
                });
                const data = await response.json();
                
                setInputs({
                    brandName: data.brandName || '',
                    website: data.website || '',
                    address: data.address || '',
                    pincode: data.pincode || '',
                    city: data.city || '',
                    state: data.state || '',
                    country: data.country || '',
                    logo: data.logo || null
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

    const handleLogoUpload = ({ file }) => {
        const reader = new FileReader();
        reader.onload = () => {
            setInputs({ ...inputs, logo: reader.result });
        };
        reader.onerror = (error) => {
            message.error('Error uploading logo!');
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/users/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('token'),
                },
                body: JSON.stringify(inputs)
            });
            
            if (response.ok) {
                message.success('Profile updated successfully!');
            } else {
                message.error('Failed to update profile.');
            }
        } catch (error) {
            console.error('Error updating user data:', error);
            message.error('An error occurred while updating the profile.');
        }
    };

    return (
        <div className='form-container'>
            <Helmet>
                <meta charSet='utf-8' />
                <meta name='description' content='' />
                <title>{title}</title>
            </Helmet>
            <form className="form" onSubmit={handleSubmit}>
                <h2 className="title">Profile</h2>
                <div className='flex-container'>
                    <div className="flex">
                        <label>
                            <span>Company Name</span>
                            <input
                                className="input"
                                type="text"
                                name="companyName"
                                value={authUser.companyName}
                                disabled
                                style={{ cursor: 'not-allowed' }}
                            />
                        </label>
                        <label>
                            <span>Company Email ID</span>
                            <input
                                className="input"
                                type="email"
                                name="email"
                                value={authUser.email}
                                disabled
                                style={{ cursor: 'not-allowed' }}
                            />
                        </label>
                        <div className='logo-upload'>
                            <label>
                                <span>Company Logo</span>
                                {inputs.logo && (
                                    <img
                                        className='company-logo'
                                        alt="Company Logo"
                                        src={inputs.logo} 
                                    />
                                )}
                            </label>
                            <Upload
                                accept="image/*"
                                customRequest={handleLogoUpload}
                                showUploadList={false}
                            >
                                <Button className='upload-btn' icon={<UploadOutlined />}>Upload Logo</Button>
                            </Upload>
                        </div>
                    </div>

                    <div className="flex">
                        <label>
                            <span>Brand Name</span>
                            <input
                                className="input"
                                type="text"
                                name="brandName"
                                value={inputs.brandName}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            <span>Website</span>
                            <input
                                className="input"
                                type="text"
                                name="website"
                                value={inputs.website}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                </div>

                <div className='flex-container'>
                    <div className="flex">
                        <label>
                            <span>Complete Address</span>
                            <input
                                className="input"
                                type="text"
                                name="address"
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
                                value={inputs.country}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                </div>
                <button className="submit-btn" type="submit">Save</button>
            </form>
        </div>
    );
};

export default Profile;
