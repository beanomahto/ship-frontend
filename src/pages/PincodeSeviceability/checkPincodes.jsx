import React, { useState } from "react";
import { Input, Button, Table, message } from "antd";
import axios from "axios";

const CheckPincode = () => {
  const [pincode, setPincode] = useState("");
  const [serviceable, setServiceable] = useState(null);
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState([]); // Initialize the data as an empty array

  const handlePincodeChange = (e) => {
    setPincode(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      checkPincode();
    }
  };

  const checkPincode = async () => {
    if (pincode.length !== 6) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }

    try {
      setError("");
      const response = await axios.get(
        `https://backend.shiphere.in/api/pincode/checkService`,
        {
          params: { pincode },
        }
      );
      console.log("Response Data:", response.data);

      const { service, pincodeData } = response.data;

      setServiceable(service);
      setCity(pincodeData ? pincodeData.city : "Unknown");

      // Update the data state with the new data
      setData([
        {
          key: 1,
          pincode,
          serviceable: service,
          city: pincodeData ? pincodeData.city : "Unknown",
        },
      ]);
    } catch (err) {
      console.error("Error checking pincode:", err);
      setError("Error checking pincode.");
      message.error("Error checking pincode.");
    }
  };

  const columns = [
    {
      title: "Pincode",
      dataIndex: "pincode",
      key: "pincode",
    },
    {
      title: "Serviceable",
      dataIndex: "serviceable",
      key: "serviceable",
      render: (text) => (text ? "Yes" : "No"),
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
    },
  ];

  return (
    <div style={{marginLeft:'4rem'}} >
      <h2 className="pincode-title">Check Pincode Serviceability</h2>
      <Input
        type="text"
        value={pincode}
        onChange={handlePincodeChange}
        onKeyPress={handleKeyPress}
        placeholder="Enter pincode"
        style={{ width: 200, marginRight: 10 }}
      />
      <Button type="primary" onClick={checkPincode}>
        Check
      </Button>
      <Table
        columns={columns}
        dataSource={data} 
        pagination={false}
        style={{ marginTop: '4rem', marginLeft:'-2rem' }}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default CheckPincode;
