import { createContext, useContext, useEffect, useState } from "react";

export const WarehouseContext = createContext();

export const useWarehouseContext = () => {
  return useContext(WarehouseContext);
};

export const WarehouseContextProvider = ({ children }) => {
  const [warehouse, setWarehouse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWarehouse = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/warehouses/getAllWarehouse`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch Warehouse");
      }
      const data = await response.json();
      setWarehouse(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchWarehouse();
  }, [setWarehouse]);

  return (
    <WarehouseContext.Provider
      value={{ warehouse, setWarehouse, fetchWarehouse, loading, error }}
    >
      {children}
    </WarehouseContext.Provider>
  );
};
