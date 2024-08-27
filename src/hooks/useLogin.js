import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";

const useLogin = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();

	const login = async (email, password) => {
		const success = handleInputErrors(email, password);
		if (!success) return;
		setLoading(true);
		try {
			const res = await fetch("https://backend.shiphere.in/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
				credentials: "include",
			});

			const data = await res.json();
			if (data.error) {
				throw new Error(data.error);
			}
			   
			localStorage.setItem("token", data.token);
			localStorage.setItem("ship-user", JSON.stringify(data));
			setAuthUser(data);

			console.log(data);
			
			await createDefaultLabelInfo(data._id);

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

			const token = localStorage.getItem('token')
			const res = await fetch("https://backend.shiphere.in/api/shipping/createlabelinfo", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: token,
				},
				body: JSON.stringify(defaultLabelInfo),
			});

			const labelInfoData = await res.json();
			if (labelInfoData.error) {
				console.warn("Labelinfo creation error:", labelInfoData.error);
			} else {
				console.log("Labelinfo created:", labelInfoData);
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
