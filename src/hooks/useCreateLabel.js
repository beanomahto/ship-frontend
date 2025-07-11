import { useState } from "react";

const useCreateLebel = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const createLebel = async ({
    // labelType,
    logoUrl,
    theme,
    hideLogo,
    hideCompanyName,
    hideCompanyGSTIN,
    hidePaymentType,
    hidePrepaidAmount,
    hideCustomerPhone,
    hideInvoiceNumber,
    hideInvoiceDate,
    showProductDetail,
    hideProductName,
    hideReturnWarehouse,
    hideWeight,
    hideDimension,
  }) => {
    const success = handleInputErrors({
      // labelType,
      logoUrl,
      theme,
      hideLogo,
      hideCompanyName,
      hideCompanyGSTIN,
      hidePaymentType,
      hidePrepaidAmount,
      hideCustomerPhone,
      hideInvoiceNumber,
      hideInvoiceDate,
      showProductDetail,
      hideProductName,
      hideReturnWarehouse,
      hideWeight,
      hideDimension,
    });
    if (!success) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/shipping/createlabelinfo`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // labelType,
            logoUrl,
            theme,
            hideLogo,
            hideCompanyName,
            hideCompanyGSTIN,
            hidePaymentType,
            hidePrepaidAmount,
            hideCustomerPhone,
            hideInvoiceNumber,
            hideInvoiceDate,
            showProductDetail,
            hideProductName,
            hideReturnWarehouse,
            hideWeight,
            hideDimension,
          }),
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      const data = await res.json();
      //console.log(data);
      if (data.error) {
        throw new Error(data.error);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, createLebel };
};
export default useCreateLebel;

function handleInputErrors({
  // labelType,
  logoUrl,
  theme,
  hideLogo,
  hideCompanyName,
  hideCompanyGSTIN,
  hidePaymentType,
  hidePrepaidAmount,
  hideCustomerPhone,
  hideInvoiceNumber,
  hideInvoiceDate,
  showProductDetail,
  hideProductName,
  hideReturnWarehouse,
  hideWeight,
  hideDimension,
}) {
  if (
    !logoUrl ||
    !theme ||
    !hideLogo ||
    !hideCompanyName ||
    !hideCompanyGSTIN ||
    !hidePaymentType ||
    !hidePrepaidAmount ||
    !hideCustomerPhone ||
    !hideInvoiceNumber ||
    !hideInvoiceDate ||
    !showProductDetail ||
    !hideProductName ||
    !hideReturnWarehouse ||
    !hideWeight ||
    !hideDimension
  ) {
    alert("Please fill in all fields");
    return false;
  }

  return true;
}
