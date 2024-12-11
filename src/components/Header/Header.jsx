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
  const handleOk = () => {
    // Handle the recharge logic
    console.log("Recharge amount:", rechargeAmount);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <div className={darktheme ? "darkHeader" : "main-header"}>
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
        <Button
          style={{ backgroundColor: "ButtonHighlight" }}
          onClick={showModal}
        >
          <BsLightningChargeFill />
          Recharge
        </Button>
        <span className="span"></span>
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
                <div className="Symbol_logo_App">
                  <p className="fstChar_logo_App">
                    {authUser?.firstName?.charAt(0).toUpperCase() +
                      " " +
                      authUser?.lastName?.charAt(0).toUpperCase()}
                  </p>
                </div>
                <Button type="text" className="name">
                  {authUser?.firstName + " " + authUser?.lastName}
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
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Recharge Now"
        cancelText="Cancel"
        centered
        bodyStyle={{
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
            {[500, 1000, 2000, 5000, 10000].map((amount) => (
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
