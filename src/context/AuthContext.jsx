import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem("ship-user")) || null
  );
  const [balance, setBalance] = useState(null);
  const [apiToken, setApiToken] = useState(null);

  const setExpiryTimer = () => {
    const expiryTime = Date.now() + 3 * 60 * 60 * 1000; // Current time + 3 hours
    localStorage.setItem("expiry-time", expiryTime.toString());
  };

  const checkExpiry = () => {
    const expiryTime = localStorage.getItem("expiry-time");
    if (expiryTime && Date.now() > parseInt(expiryTime, 10)) {
      localStorage.removeItem("token");
      localStorage.removeItem("ship-user");
      localStorage.removeItem("expiry-time");
      setAuthUser(null);
    }
  };

  const fetchBalance = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/get-balance`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch balance");
      }
      const data = await response.json();
      setBalance(data.amount);
    } catch (error) {
      //console.log(error);
    }
  };

  useEffect(() => {
    if (authUser) {
      setExpiryTimer();
      const intervalId = setInterval(checkExpiry, 60 * 1000);
      return () => clearInterval(intervalId);
    }
  }, [authUser]);

  useEffect(() => {
    if (authUser && authUser.role !== "employee") {
      fetchBalance();
    }
  }, [authUser]);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        setAuthUser,
        balance,
        fetchBalance,
        apiToken,
        setApiToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
