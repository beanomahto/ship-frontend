
import { useState } from "react";

const useAddWarehouse = () => {
	const [loading, setLoading] = useState(false);

	const addWarehouse = async ({
		contactPerson,
		warehouseName,
		contactEmail,
		contactNumber,
		pincode,
		city,
		state,
		address,
		landmark,
		country, }) => {
		const success = handleInputErrors({
			contactPerson,
			warehouseName,
			contactEmail,
			contactNumber,
			pincode,
			city,
			state,
			address,
			landmark,
			country
		});
		if (!success) return;
		setLoading(true);
		try {
			const token = localStorage.getItem('token');
			const res = await fetch("http://localhost:5000/api/warehouses/createWarehouse", {
				method: "POST",
				headers: { "Content-Type": "application/json", Authorization: `${token}`, },
				body: JSON.stringify({ warehouseName, contactPerson, contactEmail, contactNumber, pincode, city, state, address, landmark, country }),
			});

			const data = await res.json();
			//console.log(data);
			if (data.error) {
				throw new Error(data.error);
			}
		} catch (error) {
			alert(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { loading, addWarehouse };
};
export default useAddWarehouse;

function handleInputErrors({ contactPerson,
	warehouseName,
	contactEmail,
	contactNumber,
	address,
	landmark, }) {

	if (!warehouseName || !contactPerson || !contactEmail || !contactNumber || !address || !landmark) {
		alert("Please fill in all fields");
		return false;
	}

	return true;
}
