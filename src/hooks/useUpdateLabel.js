import { useState } from 'react';
import axios from 'axios'; // You might need to install axios if not already installed

const useUpdateLabel = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateLebel = async (updateLebel) => {
        console.log("lolo" + updateLebel);
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`https://backend-9u5u.onrender.com/api/shipping/updateLabelinfo`, updateLebel, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            setLoading(false);
            console.log('Updated order:', response.data);
        } catch (error) {
            setError(error);
            console.log(error);
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        updateLebel,
    };
};

export default useUpdateLabel;
