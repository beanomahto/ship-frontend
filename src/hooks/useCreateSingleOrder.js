import { useState } from "react";
//import { useOrderContext } from "../context/OrderContext";

const useCreateSingleOrder = () => {
  const [loading, setLoading] = useState(false);
  // useOrderContext()

  const createSingleOrder = async ({
    customerName,
    customerEmail,
    customerPhone,
    orderId,
    pincode,
    city,
    state,
    productPrice,
    productName,
    address,
    landMark,
    quantity,
    sku,
    weight,
    length,
    breadth,
    height,
    paymentMethod,
  }) => {
    const success = handleInputErrors({
      customerName,
      customerEmail,
      customerPhone,
      orderId,
      pincode,
      city,
      state,
      productPrice,
      productName,
      address,
      landMark,
      quantity,
      sku,
      weight,
      length,
      breadth,
      height,
      paymentMethod,
    });
    if (!success) return;
    setLoading(true);
    try {
      console.log("hi");

      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders/createOrder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify({
            customerName,
            customerEmail,
            customerPhone,
            orderId,
            pincode,
            city,
            state,
            productPrice,
            productName,
            address,
            landMark,
            quantity,
            sku,
            weight,
            length,
            breadth,
            height,
            paymentMethod,
          }),
        }
      );

      const data = await res.json();
      console.log(data);
      if (data.error) {
        throw new Error(data.error);
      }
    } catch (error) {
      alert("There is the error" + error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, createSingleOrder };
};
export default useCreateSingleOrder;

function handleInputErrors({
  customerName,
  customerEmail,
  customerPhone,
  orderId,
  productPrice,
  productName,
  address,
  quantity,
  sku,
  weight,
  length,
  breadth,
  height,
  paymentMethod,
}) {
  if (
    !customerName ||
    !customerEmail ||
    !customerPhone ||
    !orderId ||
    !productPrice ||
    !productName ||
    !address ||
    !quantity ||
    !sku ||
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
