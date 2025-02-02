import React, { useEffect, useState } from "react";
import { Button, Input, Modal, Popover, Select, Space } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import useLogout from "../../hooks/useLogout";
import "./header.css";
import { useOrderContext } from "../../context/OrderContext";
import { BsLightningChargeFill } from "react-icons/bs";

const { Search } = Input;

const Header = ({ darktheme }) => {
  const { authUser, balance } = useAuthContext();
  const { loading, logout } = useLogout();
  const navigate = useNavigate();
  //console.log(balance);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState("");

  const options = [
    {
      value: "shipment",
      label: "Shipment",
    },
    {
      value: "orderId",
      label: "OrderId",
    },
  ];

  const { orders } = useOrderContext();
  // const amount = parseFloat(authUser?.amount?.toFixed(2))
  const onSearch = (awb) => {
    //console.log(awb);

    const selectedOption = document
      .querySelector(".ant-select-selection-item")
      ?.textContent.toLowerCase();

    const filteredOrder = orders?.orders?.filter((order) => order?.awb === awb);

    //console.log(filteredOrder);

    if (selectedOption && filteredOrder.length > 0) {
      const shippingPartner = filteredOrder[0]?.shippingPartner;

      if (shippingPartner) {
        navigate(`/tracking/${selectedOption}/${shippingPartner}/${awb}`);
      } else {
        //console.log('No shipping partner found for the matching order');
      }
    } else {
      //console.log('No matching order found');
    }
  };
  // console.log(balance >= 0);
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOk = async () => {
    if (!rechargeAmount) {
      alert("Please enter a recharge amount.");
      return;
    }
    // Validate minimum recharge amount
    if (parseFloat(rechargeAmount) < 200) {
      alert(
        "The minimum recharge amount is ₹200. Please enter a valid amount."
      );
      return;
    }
    // console.log("Recharge Amount:", rechargeAmount);

    // Retrieve the token (assuming it's stored in localStorage)
    const token = localStorage.getItem("token");
    if (!token) {
      alert("User is not authenticated. Please log in.");
      return;
    }
    // console.log("Token:", token);

    try {
      // Send a POST request to the backend
      const response = await fetch(
        "https://backend.shiphere.in/api/phonepe/pay",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`, // Include the token in the Authorization header
          },
          body: JSON.stringify({ amount: rechargeAmount }), // Send the amount as JSON
        }
      );

      // console.log("Response: pay", response);

      // Handle response
      if (response.ok) {
        const redirectUrl = await response.text(); // Backend sends the URL as plain text
        console.log("Redirect URL:", redirectUrl);
        if (redirectUrl) {
          window.location.href = redirectUrl; // Redirect the user
        } else {
          alert("Failed to process the payment. Please try again.");
        }
      } else {
        const errorMessage = await response.text();
        console.error("Error Response:", errorMessage);
        alert("Failed to connect to the server. Please try again later.");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsModalVisible(false);
    }
  };
  // console.log(authUser);

  return (
    <div className={darktheme ? "darkHeader" : "main-header"} style={{ width: "99%" }}>
      <div className="header-container">
        <div className="header-search">
          <Space.Compact>
            <Select defaultValue="shipment" options={options} />
            <Search placeholder="Search AWB Number(s)" onSearch={onSearch} />
          </Space.Compact>
        </div>
        <span className="span"></span>
        <Button
          className={`${balance >= 0 ? "money" : "insuffient"}`}
          type="default"
        >
          &#8377; {balance?.toFixed(2)}
        </Button>
        <span className="span"></span>

        <>
          <Button
            style={{ backgroundColor: "ButtonHighlight", padding: "5px" }}
            onClick={showModal}
          >
            <BsLightningChargeFill className="rechargeLogo"/>
            Recharge
          </Button>
          <span className="span"></span>
        </>

        {authUser ? (
          <>
            <Popover
              className="profile"
              placement="bottomLeft"
              trigger={"click"}
              title={
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    margin: ".5rem",
                    gap: "1rem",
                  }}
                >
                  <Button>
                    <Link to="/profile">Profile</Link>
                  </Button>
                  <Button>
                    <Link to="/kyc">KYC</Link>
                  </Button>
                  <Button onClick={logout}>Logout</Button>
                </div>
              }
            >
              <div className="Auth_Navbar">
                <div className="Symbol_logo_App" style={{ backgroundColor: "rgb(248, 191, 191)" , color: "rgb(43, 4, 4)", fontWeight: "bolder", width: "3rem", height: "2.7rem", marginRight: "10px" }}>
                  <p className="fstChar_logo_App" style={{ fontWeight: "bold", fontSize: "1.3rem",}}>
                    {authUser?.firstName?.charAt(0).toUpperCase() +
                      "" +
                      authUser?.lastName?.charAt(0).toUpperCase()}
                  </p>
                </div>
                <Button type="text" className="name" style={{ width: "fit-content", padding: "0px" }}>
                  {authUser?.firstName?.toUpperCase() + " " + authUser?.lastName?.toUpperCase()}
                </Button>
              </div>
            </Popover>
          </>
        ) : (
          <Button>
            <Link to="/login">Login</Link>
          </Button>
        )}
      </div>
      <Modal
        title={
          <div
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "20px",
            }}
          >
            🚀 Upgrade Your Limit
          </div>
        }
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Recharge Now"
        cancelText="Cancel"
        centered
        style={{
          padding: "20px",
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
        }}
        footer={[
          <Button
            key="cancel"
            onClick={handleCancel}
            style={{
              backgroundColor: "#f44336",
              color: "#fff",
              borderRadius: "5px",
            }}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            onClick={handleOk}
            style={{
              backgroundColor: "#0073e6",
              color: "#fff",
              borderRadius: "5px",
            }}
          >
            Recharge Now
          </Button>,
        ]}
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <p style={{ fontSize: "16px", color: "#555" }}>
            Enter the amount you want to recharge
          </p>
          <Input
            placeholder="Enter Amount"
            value={rechargeAmount}
            onChange={(e) => setRechargeAmount(e.target.value)}
            style={{
              width: "100%",
              marginBottom: "20px",
              borderRadius: "5px",
              padding: "10px",
            }}
          />
        </div>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <p style={{ fontSize: "14px", color: "#777" }}>
            Quick Recharge Options:
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            {[200, 500, 1000, 2000, 5000, 10000, 20000].map((amount) => (
              <Button
                key={amount}
                onClick={() => setRechargeAmount(amount)}
                style={{
                  backgroundColor: "#E0F7FA",
                  color: "#00796B",
                  borderRadius: "5px",
                  border: "1px solid #00796B",
                  fontWeight: "bold",
                  width: "80px",
                  height: "40px",
                }}
              >
                ₹{amount}
              </Button>
            ))}
          </div>
        </div>
        <div style={{ textAlign: "center", color: "#777", fontSize: "14px" }}>
          <p>
            Your current balance is:{" "}
            <span style={{ color: "#4CAF50", fontWeight: "bold" }}>
              ₹{balance?.toFixed(2)}
            </span>
          </p>
          <p>Recharge now to continue shipping seamlessly!</p>
        </div>
      </Modal>
    </div>
  );
};

export default Header;
