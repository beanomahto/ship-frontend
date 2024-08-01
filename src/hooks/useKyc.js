import { useState } from "react";

const useKycIntegration = () => {
  const [loading, setLoading] = useState(false);

  const kycIntegration = async ({ 
    name,
        ifscCode,
        bankName,
    companyType,
    documentType,
    gstUrl,
    accountNumber,
    passbookNumber,
    passbookUrl,
    gstin,
    pancard,
    pancardUrl, }) => {
    const success = handleInputErrors({
      name,
        ifscCode,
        bankName,
      companyType,
      documentType,
      gstUrl,
      accountNumber,
      passbookNumber,
      passbookUrl,
      gstin,
      pancard,
      pancardUrl,
    });
    if (!success) return;

    setLoading(true);
    try {
      const res = await fetch("/api/kyc/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
        ifscCode,
        bankName,
          companyType,
          documentType,
          gstUrl,
          accountNumber,
          passbookNumber,
          passbookUrl,
          gstin,
          pancard,
          pancardUrl,
        }),
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

  return { loading, kycIntegration };
};
export default useKycIntegration;

function handleInputErrors({ 
  name,
        ifscCode,
        bankName,
  companyType,
  documentType,
  gstUrl,
  accountNumber,
  passbookNumber,
  passbookUrl,
  gstin,
  pancard,
  pancardUrl, }) {

  if (!name,
    !ifscCode,
    !bankName,!companyType || !documentType || !gstUrl || !accountNumber || !passbookNumber || !passbookUrl || !gstin || !pancard || !pancardUrl) {
    alert("please fill all the inputs")
    return false;
  }

  return true;
}