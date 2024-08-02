import { useState, useEffect } from 'react';
import axios from 'axios';

const useShippingRateCard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRateCard = async () => {
            try {
                const response = await axios.get('https://backend-9u5u.onrender.com/api/shipping/rateCard');
                setData(response.data);
                console.log(response);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRateCard();
    }, []);

    return { data, loading, error };
};

export default useShippingRateCard;
