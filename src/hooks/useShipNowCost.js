import { useState } from "react";

const useShipNowCost = () => {
  const [loading, setLoading] = useState(false);

  const shipNowCost = async (orderId, wareHouseId) => {
    const success = handleInputErrors(orderId, wareHouseId);
    if (!success) return { success: false };

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch("https://backend.shiphere.in/api/shipping/getSingleDeliveryCost", {
        method: "POST",
        body: JSON.stringify({ orderId, wareHouseId }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`
        },
      });

      console.log(res);

      if (!res.ok) {
        throw new Error("Failed to fetch delivery cost. Please try again.");
      }

      const data = await res.json();
      console.log(data?.result);
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
  if (!orderId || !wareHouseId) {
    alert("Please fill in all fields in useShipNow");
    return false;
  }
  return true;
}

export default useShipNowCost;
