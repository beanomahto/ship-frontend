    import { createContext, useContext, useEffect, useState } from "react";

    export const OrderContext = createContext();

    export const useOrderContext = () => {
        return useContext(OrderContext);
    };

    export const OrderContextProvider = ({ children }) => {
        const [orders, setOrders] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const response = await fetch('https://backend-9u5u.onrender.com/api/orders/getAllOrders', {
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }
                const data = await response.json();
                setOrders(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {

            fetchOrders();
        }, []);

        return (
            <OrderContext.Provider value={{ orders, setOrders, loading, error, fetchOrders }}>
                {children}
            </OrderContext.Provider>
        );
    };