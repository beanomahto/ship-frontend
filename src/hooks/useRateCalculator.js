import { useState } from "react";

const useRateCalculator = () => {
  const [loading, setLoading] = useState(false);

  const rateCalculator = async ({
    deliveryPartner,
    pickupPincode,
    deliveryPincode,
    weight,
    length,
    breadth,
    height,
    paymentMethod,
  }) => {
    const success = handleInputErrors({
      deliveryPartner,
      pickupPincode,
      deliveryPincode,
      weight,
      length,
      breadth,
      height,
      paymentMethod,
    });
    if (!success) return { success: false };

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders/rateCalculator`,
        {
          method: "POST",
          body: JSON.stringify({
            deliveryPartner,
            pickupPincode,
            deliveryPincode,
            weight,
            length,
            breadth,
            height,
            paymentMethod,
          }),
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
      //console.log(data);
      setLoading(false);
      return { success: true, cost: data.cost };
    } catch (error) {
      console.error("Error fetching delivery cost:", error);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };
  //   515741

  return { loading, rateCalculator };
};

export default useRateCalculator;

function handleInputErrors({
  deliveryPartner,
  pickupPincode,
  deliveryPincode,
  weight,
  length,
  breadth,
  height,
  paymentMethod,
}) {
  if (
    !deliveryPartner ||
    !pickupPincode ||
    !deliveryPincode ||
    !weight ||
    !length ||
    !breadth ||
    !height ||
    !paymentMethod
  ) {
    alert("Please fill in all fields");
    return false;
  }
  return true;
}
