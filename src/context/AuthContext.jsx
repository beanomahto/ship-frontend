
import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const useAuthContext = () => {
	return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
	const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem("ship-user")) || null);
	const [balance, setBalance] = useState(null);
	const fetchBalance = async () => {
		try {
			const response = await fetch('https://backend.shiphere.in/api/auth/get-balance',{
				headers:{
					'Authorization': localStorage.getItem('token')
				}
			}); 
	if (!response.ok) {
	  throw new Error('Failed to fetch balance');
	}
	const data = await response.json();
	setBalance(data.amount);
		} catch (error) {
			console.log(error);
			
		}
	}
	useEffect(() => {
		fetchBalance();
	}, [authUser])

	return <AuthContext.Provider value={{ authUser, setAuthUser, balance, fetchBalance }}>{children}</AuthContext.Provider>;
};
