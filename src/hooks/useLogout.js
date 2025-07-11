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
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/logout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
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
