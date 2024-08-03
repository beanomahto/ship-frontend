import { useState } from 'react';
import axios from 'axios'; // You might need to install axios if not already installed

const useUpdateOrder = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateOrder = async (updatedOrderData) => {
        console.log("lolo" + updatedOrderData?._id);
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`https://backend-9u5u.onrender.com/api/orders/updateOrder/${updatedOrderData._id}`, updatedOrderData, {
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
        updateOrder,
    };
};

export default useUpdateOrder;
