import { useState } from "react";

const useShipNowCost = () => {
  const [loading, setLoading] = useState(false);

  const shipNowCost = async (orderId, wareHouseId) => {
    console.log("There is the warehouseid", wareHouseId);

    const success = handleInputErrors(orderId, wareHouseId);
    if (!success) return { success: false };

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/shipping/getSingleDeliveryCost`,
        {
          method: "POST",
          body: JSON.stringify({ orderId, wareHouseId }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch delivery cost. Please try again.");
      }

      const data = await res.json();
      console.log("Response data:", data);
      console.log("There is the data", data);

      setLoading(false);
      return { success: true, cost: data.result };
    } catch (error) {
      console.error("Error fetching delivery cost:", error);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  return { loading, shipNowCost };
};

function handleInputErrors(orderId, wareHouseId) {
  if (!wareHouseId) {
    alert("warehouse not found");
    return false;
  }
  if (!orderId) {
    alert("please select the order");
    return false;
  }
  return true;
}

export default useShipNowCost;
