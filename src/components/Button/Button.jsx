import React from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { Button } from 'antd';

const CustomButton = ({ children, ...props }) => {
    const { authUser } = useAuthContext();

    // Conditionally render the button only if the user is an admin
    if (authUser?.role !== 'admin') return null;

    return (
        <Button style={{borderRadius:'50px', padding:'1rem', backgroundColor:'#ffffff94'}} {...props}>
            {children}
        </Button>
    );
};

export default CustomButton;
