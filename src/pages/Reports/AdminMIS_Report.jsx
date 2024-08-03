import React, { useState } from 'react';
import { message } from 'antd';

const AdminMIS_Report = () => {
    const [email, setEmail] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            email,
        };

        try {
            const response = await fetch('https://backend-9u5u.onrender.com/api/report/misreport', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('token'),
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'orders_report.xlsx');
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
                message.success('MIS Download successfully');
                setEmail('');
            } else {
                message.error('Failed to download MIS');
            }
        } catch (error) {
            message.error('An error occurred while downloading MIS');
        }
    };

    return (
        <div className='formConsprt'>
            <form className="formsprt" onSubmit={handleSubmit}>
                <p className="titlesprt">Download Report</p>
                <div className='flex2sprt'>
                    <div className="flexsprt">
                        <label className='iptsprt'>
                            <span>Email</span>
                            <input
                                className="inputsprt"
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                required
                            />
                        </label>
                    </div>
                </div>
                <button className="submitsprt" type="submit">Submit</button>
            </form>
        </div>
    );
};

export default AdminMIS_Report;
