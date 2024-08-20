import { createContext, useContext, useEffect, useState } from "react";

export const WarehouseContext = createContext();

export const useWarehouseContext = () => {
    return useContext(WarehouseContext);
};

export const WarehouseContextProvider = ({ children }) => {
    const [warehouse, setWarehouse] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWarehouse = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const response = await fetch('https://backend.shiphere.in/api/warehouses/getAllWarehouse', {
                    headers: {
                        Authorization: `${token}`,
                    },
                }); 
                if (!response.ok) {
                    throw new Error('Failed to fetch Warehouse');
                }
                const data = await response.json();
                setWarehouse(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWarehouse();
    }, [setWarehouse]);

    return (
        <WarehouseContext.Provider value={{ warehouse, setWarehouse, loading, error }}>
            {children}
        </WarehouseContext.Provider>
    );
};
