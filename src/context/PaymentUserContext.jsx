import { createContext, useContext, useEffect, useState } from "react";

export const PaymentUserContext = createContext();

export const usePaymentUserContext = () => {
    return useContext(PaymentUserContext);
};

export const PaymentUserContextProvider = ({ children }) => {
    const [pUsers, setPUers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWarehouse = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/transactions/getAllTransactions'); 
                if (!response.ok) {
                    throw new Error('Failed to fetch Payment Users');
                }
                const data = await response.json();
                setPUers(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWarehouse();
    }, [setPUers]);

    return (
        <PaymentUserContext.Provider value={{ pUsers, setPUers, loading, error }}>
            {children}
        </PaymentUserContext.Provider>
    );
};
