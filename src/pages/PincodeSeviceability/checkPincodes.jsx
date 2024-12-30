import React, { useState } from "react";
import { Input, Button, Table, message, Spin } from "antd";
import axios from "axios";
import DLVRY from "../../utils/newlogo/delhivery.png";
import AS from "../../utils/newlogo/amazonShippinglogo.jpg";
import EE from "../../utils/newlogo/ecom-logo.jpg";
import XPB from "../../utils/newlogo/Xpressbees.jpg";
import Ekart from "../../utils/newlogo/ekartlogo.png";
import Dtdc from "../../utils/newlogo/dtdc.png";
import SF from "../../utils/newlogo/shadowfax.png";
import BD from "../../utils/newlogo/bluedartlogo.png";

const partnerLogos = {
  Delhivery: DLVRY,
  Amazon: AS,
  EcomExpress: EE,
  Xpressbees: XPB,
  Ekart: Ekart,
  DTDC: Dtdc,
  Shadowfax: SF,
  BlueDart: BD,
};

const CheckPincode = () => {
  const [pincode, setPincode] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false); // New state for loading

  const handlePincodeChange = (e) => {
    setPincode(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      checkPincode();
    }
  };

  const checkPincode = async () => {
    if (pincode.length !== 6 || isNaN(pincode)) {
      setError("Please enter a valid 6-digit numeric pincode.");
      return;
    }

    try {
      setError("");
      setLoading(true); // Start loading
      // const response = await axios.get(
      //   `https://backend.shiphere.in/api/pincode/delivery-partners/${pincode}`,
      //   {
      //     params: { pincode },
      //   }
      // );
      const response = await fetch(
        `http://localhost:5000/api/delivery-partners/${pincode}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      // Check if the response is OK (status 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const { pincode: fetchedPincode, deliveryPartners } =
        await response.json();

      if (!deliveryPartners || deliveryPartners.length === 0) {
        setData([]);
        message.warning("No delivery partners found for this pincode.");
        return;
      }

      const formattedData = deliveryPartners.map((partner, index) => {
        const normalizedName = partner.name.replace(/\s+/g, "").toLowerCase();
        const logo =
          partnerLogos[
            Object.keys(partnerLogos).find(
              (key) => key.replace(/\s+/g, "").toLowerCase() === normalizedName
            )
          ] || null;

        return {
          key: index + 1,
          name: partner.name,
          logo: logo,
          city: partner.city || partner.route_code,
          pincode: fetchedPincode,
          serviceability: "Yes",
        };
      });
      setData(formattedData);
    } catch (err) {
      console.error("Error checking pincode:", err);
      setError("Error checking pincode.");
      message.error("Error checking pincode.");
    } finally {
      setLoading(false); // End loading
    }
  };

  const columns = [
    {
      title: "Partner",
      dataIndex: "logo",
      key: "logo",
      render: (text, record) =>
        record.logo ? (
          <img
            src={record.logo}
            alt={record.name}
            style={{ width: 140, height: 40 }}
          />
        ) : (
          "N/A"
        ),
    },
    // {
    //   title: "Partner Name",
    //   dataIndex: "name",
    //   key: "name",
    // },
    {
      title: "Pincode",
      dataIndex: "pincode",
      key: "pincode",
    },
    {
      title: "Serviceable",
      dataIndex: "serviceability",
      key: "serviceability",
      render: () => (
        <span
          style={{
            fontWeight: "bold",
            color: "green",
          }}
        >
          Yes
        </span>
      ),
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
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
      <Spin spinning={loading} size="large" style={{ marginTop: "4rem" }}>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          style={{ marginTop: "4rem", marginLeft: "-2rem" }}
        />
      </Spin>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default CheckPincode;
