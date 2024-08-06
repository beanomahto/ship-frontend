import React, { useState } from "react";
import axios from "axios";

const CheckPincode = () => {
  const [pincode, setPincode] = useState("");
  const [serviceable, setServiceable] = useState(null);
  const [city, setCity] = useState("");
  const [error, setError] = useState("");

  const handlePincodeChange = (e) => {
    setPincode(e.target.value);
  };

  const checkPincode = async () => {
    if (pincode.length !== 6) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }

    try {
      setError("");
      // Send pincode as query parameter
      //   console.log(pincode);
      const response = await axios.get(
        `https://backend-9u5u.onrender.com/api/pincode/checkService`,
        {
          params: { pincode },
        }
      );
      console.log("Response Data:", response.data); // Debugging line

      const { service, pincodeData } = response.data;

      setServiceable(service);
      setCity(pincodeData ? pincodeData.city : "Unknown");
    } catch (err) {
      console.error("Error checking pincode:", err);
      setError("Error checking pincode.");
    }
  };

  return (
    <div>
      <h2>Check Pincode Serviceability</h2>
      <input
        type="text"
        value={pincode}
        onChange={handlePincodeChange}
        placeholder="Enter pincode"
      />
      <button onClick={checkPincode}>Check</button>
      {serviceable !== null && (
        <p>
          Pincode is {serviceable ? "serviceable" : "not serviceable"}.
          {serviceable && city && ` City: ${city}`}
        </p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default CheckPincode;
