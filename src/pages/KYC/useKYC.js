import { message } from "antd";
import { useState } from "react";

const useKYC = () => {
  const [loading, setLoading] = useState(false);

  const submitKYCForm = async (formData) => {
    setLoading(true);
    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("name", formData.name);
      formDataToSubmit.append("ifscCode", formData.ifscCode);
      formDataToSubmit.append("bankName", formData.bankName);
      formDataToSubmit.append("companyType", formData.companyType);
      formDataToSubmit.append("documentType", formData.documentType);
      formDataToSubmit.append("gstin", formData.gstin);
      formDataToSubmit.append("accountNumber", formData.accountNumber);
      formDataToSubmit.append("pancard", formData.pancard);
      formDataToSubmit.append("aadharNumber", formData.aadharNumber);

      if (formData.gstUrl) {
        formDataToSubmit.append("files", formData.gstUrl, formData.gstUrl.name);
      }
      if (formData.passbookUrl) {
        formDataToSubmit.append(
          "files",
          formData.passbookUrl,
          formData.passbookUrl.name
        );
      }
      if (formData.pancardUrl) {
        formDataToSubmit.append(
          "files",
          formData.pancardUrl,
          formData.pancardUrl.name
        );
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/kyc/create`,
        {
          method: "POST",
          headers: {
            Authorization: localStorage.getItem("token"),
          },
          body: formDataToSubmit,
        }
      );

      if (response.ok) {
        const data = await response.json();
        message.success("KYC information saved successfully");
        return data;
      } else {
        throw new Error("Failed to save KYC information");
      }
    } catch (error) {
      message.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { submitKYCForm, loading };
};

export default useKYC;
