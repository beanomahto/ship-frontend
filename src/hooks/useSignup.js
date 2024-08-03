import { useState } from "react";
// import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useSignup = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();

	const signup = async ({ firstName, lastName, email, password, companyName, phoneNumber }) => {
		const success = handleInputErrors({ firstName, lastName, email, password, companyName, phoneNumber });
		if (!success) return;

		setLoading(true);
		try {
			const res = await fetch("https://backend-9u5u.onrender.com/api/auth/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ firstName, lastName, email, password, companyName, phoneNumber }),
				credentials: "include",
			});

			const data = await res.json();
			console.log(data);
			if (data.error) {
				throw new Error(data.error);
			}
			localStorage.setItem("token", data.token);
			localStorage.setItem("ship-user", JSON.stringify(data));
			setAuthUser(data);
		} catch (error) {
			alert(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { loading, signup };
};
export default useSignup;

function handleInputErrors({ firstName, lastName, email, password, companyName, phoneNumber }) {
	if (!firstName || !lastName || !email || !password || !companyName || !phoneNumber) {
		// toast.error("Please fill in all fields");
		alert("please fill all the inputs")
		return false;
	}

	if (password.length < 6) {
		alert("Password must be at least 6 characters");
		return false;
	}

	return true;
}