// import { useState } from "react";
// import { useAuthContext } from "../context/AuthContext";

// const useLogin = () => {
//   const [loading, setLoading] = useState(false);
//   const { setAuthUser } = useAuthContext();

//   const login = async (email, password) => {
//     const success = handleInputErrors(email, password);
//     if (!success) return;
//     setLoading(true);
//     try {
//       const res = await fetch("http://localhost:3001/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//         credentials: "include",
//       });
//       //console.log(res);
//       const data = await res.json();
//       if (data.error) {
//         throw new Error(data.error);
//       }

//       localStorage.setItem("token", data.token);
//       localStorage.setItem("ship-user", JSON.stringify(data));
//       setAuthUser(data);

//       //console.log(data);

//       await createDefaultLabelInfo(data._id);
//     } catch (error) {
//       console.error("Login error:", error);
//       alert(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const createDefaultLabelInfo = async (userId) => {
//     try {
//       const defaultLabelInfo = {
//         theme: "defaultTheme",
//         hideLogo: false,
//         hideCompanyName: false,
//         hideCompanyGSTIN: false,
//         hidePaymentType: false,
//         hidePrepaidAmount: false,
//         hideCustomerPhone: false,
//         hideInvoiceNumber: false,
//         hideInvoiceDate: false,
//         showProductDetail: true,
//         hideProductName: false,
//         hideReturnWarehouse: false,
//         hideWeight: false,
//         hideDimension: false,
//         userId,
//       };

//       const token = localStorage.getItem("token");
//       const res = await fetch(
//         "http://localhost:3001/api/shipping/createlabelinfo",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: token,
//           },
//           body: JSON.stringify(defaultLabelInfo),
//         }
//       );

//       const labelInfoData = await res.json();
//       if (labelInfoData.error) {
//         console.warn("Labelinfo creation error:", labelInfoData.error);
//       } else {
//         //console.log("Labelinfo created:", labelInfoData);
//       }
//     } catch (error) {
//       console.error("Error creating default Label Info:", error);
//     }
//   };

//   return { loading, login };
// };

// export default useLogin;

// function handleInputErrors(email, password) {
//   if (!email || !password) {
//     alert("Please fill in all fields");
//     return false;
//   }
//   return true;
// }

import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();
  // const {fetchOrders}
  const login = async (email, password, isHashed) => {
    const success = handleInputErrors(email, password, isHashed);
    if (!success) return;

    // LOGIN API == http://localhost:3001/api/auth/login
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, isHashed }),
        credentials: "include", // To include cookies for same-site requests
      });

      if (!res.ok) {
        // Handle non-200 responses (e.g., 400 or 500 errors)
        const errorData = await res.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await res.json();
      if (data.role === "employee") {
        localStorage.setItem("employee-token", data.token);
        // localStorage.setItem("ship-user", JSON.stringify(data));
      }
      // Store token and user details in localStorage
      else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("ship-user", JSON.stringify(data));
      }
      setAuthUser(data); // Set the user data in AuthContext

      //console.log("User logged in:", data);

      // Create default label info after successful login
      await createDefaultLabelInfo(data._id);

      return data; // Return user data for further usage in your component (e.g., role checking)
    } catch (error) {
      console.error("Login error:", error);
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

      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:3001/api/shipping/createlabelinfo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token properly
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

  return { loading, login };
};

export default useLogin;

function handleInputErrors(email, password) {
  if (!email || !password) {
    alert("Please fill in all fields");
    return false;
  }
  return true;
}
