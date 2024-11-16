import React, { useState } from "react";
import { Input, Button, Table, message } from "antd";
import axios from "axios";

const CheckPincode = () => {
  const [pincode, setPincode] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState([]);

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
        `http://localhost:5000/api/delivery-partners`,
        {
          params: { pincode },
        }
      );
      console.log("Response Data:", response.data);

      const { pincode: fetchedPincode, deliveryPartners } = response.data;

      if (!deliveryPartners || deliveryPartners.length === 0) {
        setData([]);
        message.warning("No delivery partners found for this pincode.");
        return;
      }

      const formattedData = deliveryPartners.map((partner, index) => ({
        key: index + 1,
        name: partner.name,
        city: partner.city ? partner.city :  partner.route_code,
        country: partner.route_code,
        pincode: fetchedPincode,
      }));

      setData(formattedData);
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
      key: "name",
    },
    {
      title: "Partner Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "City",
      dataIndex: "city",
    },
  ];

  return (
    <div style={{ marginLeft: "4rem" }}>
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
        style={{ marginTop: "4rem", marginLeft: "-2rem" }}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default CheckPincode;
