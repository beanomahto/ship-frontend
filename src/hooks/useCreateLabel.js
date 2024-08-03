
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
        hideDimension }) => {
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
            hideDimension
        });
        if (!success) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch("https://backend-9u5u.onrender.com/api/shipping/createlabelinfo", {
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
                    hideDimension
                }),
                headers: {
                    Authorization: `${token}`,
                },
            });

            const data = await res.json();
            console.log(data);
            if (data.error) {
                throw new Error(data.error);
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    // const getLebel = async () => {
    //     try {
    //         const response = await fetch('https://backend-9u5u.onrender.com/api/shipping/getLabelinfo');
    //         const data = await response.json()
    //         setData(data);
    //         console.log(data);
    //         console.log(response);
    //     } catch (err) {
    //         setError(err);
    //     } finally {
    //         setLoading(false);
    //     }
    // }

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
    hideDimension }) {

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
        !hideDimension) {
        alert("Please fill in all fields");
        return false;
    }

    return true;
}
