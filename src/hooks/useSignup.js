import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const signup = async ({
    firstName,
    lastName,
    email,
    password,
    companyName,
    phoneNumber,
    otp,
  }) => {
    const success = handleInputErrors({
      firstName,
      lastName,
      email,
      password,
      companyName,
      phoneNumber,
      otp,
    });
    if (!success) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
            companyName,
            phoneNumber,
            otp,
          }),
          credentials: "include",
        }
      );

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      //console.log(data);

      localStorage.setItem("token", data.token);
      localStorage.setItem("ship-user", JSON.stringify(data));
      setAuthUser(data);

      await createDefaultLabelInfo(data._id);
      return data.apiToken || ""; // return API token
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultLabelInfo = async (userId) => {
    try {
      const defaultLabelInfo = {
        theme: "defaultTheme",
        hideLogo: false,
        hideCompanyName: false,
        hideCompanyGSTIN: false,
        hidePaymentType: false,
        hidePrepaidAmount: false,
        hideCustomerPhone: false,
        hideInvoiceNumber: false,
        hideInvoiceDate: false,
        showProductDetail: true,
        hideProductName: false,
        hideReturnWarehouse: false,
        hideWeight: false,
        hideDimension: false,
        userId,
      };

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/shipping/createlabelinfo`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(defaultLabelInfo),
        }
      );

      const labelInfoData = await res.json();
      if (labelInfoData.error) {
        console.warn("Labelinfo creation error:", labelInfoData.error);
      } else {
        //console.log("Labelinfo created:", labelInfoData);
      }
    } catch (error) {
      console.error("Error creating default Label Info:", error);
    }
  };

  return { loading, signup };
};
export default useSignup;

function handleInputErrors({
  firstName,
  lastName,
  email,
  password,
  companyName,
  phoneNumber,
  otp,
}) {
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !companyName ||
    !phoneNumber ||
    !otp
  ) {
    alert("Please fill in all fields");
    return false;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters");
    return false;
  }

  return true;
}
