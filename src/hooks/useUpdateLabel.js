import axios from 'axios';
import { useState } from 'react';

const useUpdateLabel = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateLebel = async (updateLebel) => {
        //console.log(updateLebel);
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`http://localhost:3001/api/shipping/updateLabelinfo`, updateLebel, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            setLoading(false);
            //console.log('Updated order:', response.data);
        } catch (error) {
            setError(error);
            //console.log(error);
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
