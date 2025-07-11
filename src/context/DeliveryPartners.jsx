import { createContext, useContext, useEffect, useState } from "react";

export const DeliveryPartner = createContext();

export const useDeliveryPartner = () => {
  return useContext(DeliveryPartner);
};

export const DeliveryPartnerProvider = ({ children }) => {
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeliveryPartners = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/shipping/getDeliveryPartners`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch delivery partners");
        }
        const data = await response.json();
        setDeliveryPartners(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryPartners();
  }, [setDeliveryPartners]);

  return (
    <DeliveryPartner.Provider
      value={{ deliveryPartners, setDeliveryPartners, loading, error }}
    >
      {children}
    </DeliveryPartner.Provider>
  );
};
