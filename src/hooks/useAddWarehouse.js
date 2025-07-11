import { useState } from "react";

const useAddWarehouse = () => {
  const [loading, setLoading] = useState(false);

  const addWarehouse = async ({
    contactPerson,
    warehouseName,
    contactEmail,
    contactNumber,
    pincode,
    city,
    state,
    address,
    landmark,
    country,
  }) => {
    const success = handleInputErrors({
      contactPerson,
      warehouseName,
      contactEmail,
      contactNumber,
      pincode,
      city,
      state,
      address,
      landmark,
      country,
    });
    if (!success) return;

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      // Step 1: Create warehouse in MongoDB
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/warehouses/createWarehouse`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify({
            warehouseName,
            contactPerson,
            contactEmail,
            contactNumber,
            pincode,
            city,
            state,
            address,
            landmark,
            country,
          }),
        }
      );

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      // Step 2: Call Delhivery API via backend
      const deliveryRes = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/deliveryOne/create-delhivery-warehouse`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify({
            phone: contactNumber,
            city: city,
            name: warehouseName,
            pin: pincode,
            address: address,
            country: country,
            email: contactEmail,
            registered_name: warehouseName, // or your business name
            return_address: address,
            return_pin: pincode,
            return_city: city,
            return_state: state,
            return_country: country,
          }),
        }
      );

      const deliveryData = await deliveryRes.json();

      if (!deliveryData.success) {
        alert("Warehouse created in DB, but failed on Delhivery");
      } else {
        alert("Warehouse successfully created in DB and Delhivery.");
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, addWarehouse };
};

export default useAddWarehouse;

function handleInputErrors({
  contactPerson,
  warehouseName,
  contactEmail,
  contactNumber,
  address,
  landmark,
}) {
  if (
    !warehouseName ||
    !contactPerson ||
    !contactEmail ||
    !contactNumber ||
    !address ||
    !landmark
  ) {
    alert("Please fill in all fields");
    return false;
  }
  return true;
}
