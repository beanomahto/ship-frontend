import { useState, useEffect } from 'react';
import axios from 'axios'; 

const useGetSingleOrderWithId = () => {
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState(null);
    const [error, setError] = useState(null);

    const getSingleOrderWithId = async (orderId) => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/orders/${orderId}`);
            setOrder(response.data);
            setLoading(false);
            console.log(response.data);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };

    return {
        loading,
        order,
        error,
        getSingleOrderWithId,
    };
};

export default useGetSingleOrderWithId;
