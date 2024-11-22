import { useState } from 'react';
import axios from 'axios';

const useUpdateOrder = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateOrder = async (updatedOrderData) => {
        console.log(updatedOrderData);
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`https://backend.shiphere.in/api/orders/updateOrder/${updatedOrderData._id}`, updatedOrderData, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            console.log(response.data);
            
            setLoading(false);
            return response.data;
        } catch (error) {
            setError(error);
            //console.log(error);
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        updateOrder,
    };
};

export default useUpdateOrder;
