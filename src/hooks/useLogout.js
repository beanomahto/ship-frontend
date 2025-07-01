// import { useState } from "react";
// import { useAuthContext } from "../context/AuthContext";
// // import toast from "react-hot-toast";

// const useLogout = () => {
//   const [loading, setLoading] = useState(false);
//   const { setAuthUser } = useAuthContext();

//   const logout = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("https://backend.shiphere.in/api/auth/logout", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//       });
//       const data = await res.json();
//       if (data.error) {
//         throw new Error(data.error);
//       }

//       localStorage.removeItem("token");
//       localStorage.removeItem("ship-user");
//       setAuthUser(null);
//     } catch (error) {
//       alert(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { loading, logout };
// };
// export default useLogout;

import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useAuthContext } from "../context/AuthContext";

const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();
  const navigate = useNavigate(); // Initialize navigate

  const logout = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      localStorage.removeItem("token");
      localStorage.removeItem("ship-user");

      const employeeToken = localStorage.getItem("employee-token");
      if (employeeToken) {
        navigate("/employeedashboard");
      } else {
        navigate("/login");
      }
      setAuthUser(null);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, logout };
};
export default useLogout;
