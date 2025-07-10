import { Button, Card } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import shopify from "../../utils/shopify.png";
import woo from "../../utils/woocomerce.png";
import "./channelIntegration.css";
import ChannelIntegrationModel from "./channelIntegrationMoodel/ChannelIntegrationModel";

const ChannelIntegration = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [userChannels, setUserChannels] = useState([]);
  const [adminChannels, setAdminChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { authUser } = useAuthContext();
  console.log(authUser.role);

  const fetchChannels = async () => {
    try {
      const response = await axios.get(
        `${process.env.url}/integration/getAllApi`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setUserChannels(response.data);
      console.log(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch channels");
      setLoading(false);
    }
  };

  const fetchAdminChannels = async () => {
    try {
      const response = await axios.get(
        `${process.env.url}/api/integration/getAllApiAdmin`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setAdminChannels(response.data);
      console.log(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch API keys for admin");
      setLoading(false);
    }
  };
  useEffect(() => {
    if (authUser.role === "admin") {
      fetchAdminChannels();
    } else {
      fetchChannels();
    }
  }, [authUser.role]);

  const showModal = (channel) => {
    setSelectedChannel(channel);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="channelINMain">
      {authUser.role !== "admin" && (
        <>
          <Helmet>
            <meta charSet="utf-8" />
            <meta name="keyword" content={""} />
            <title>Channel Integration</title>
          </Helmet>

          <h2>Channel Integration</h2>
          <div className="channelsToIn">
            <Card title="Shopify" className="channelCard" bordered={true}>
              <img className="logo" src={shopify} alt="Shopify Logo" />
              <Button type="primary">
                <Link to={"/channelintegration/shopify"}>Integrate</Link>
              </Button>
            </Card>
            <Card title="WooCommerce" className="channelCard" bordered={true}>
              <img className="logo" src={woo} alt="WooCommerce Logo" />
              <Button type="primary">
                <Link to={"/channelintegration/wooCommerce"}>Integrate</Link>
              </Button>
            </Card>
          </div>
        </>
      )}

      {authUser.role === "admin" ? (
        <>
          <h2 style={{ marginTop: "2rem", marginBottom: "2rem" }}>
            Admin: All API Keys
          </h2>
          <div className="userChannels">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : adminChannels.length > 0 ? (
              adminChannels.map((channel) => (
                <Card
                  key={channel.id}
                  title={channel.salesChannel}
                  className="channelCard"
                  bordered={true}
                >
                  <div className="channelCard-ki-image">
                    <img
                      className="logo"
                      src={channel.salesChannel === "shopify" ? shopify : woo}
                      alt={`${channel.salesChannel} Logo`}
                    />
                  </div>
                  <Button type="primary" onClick={() => showModal(channel)}>
                    View Details
                  </Button>

                  <p style={{ marginTop: "8px" }}>
                    <strong>Seller Email:</strong>{" "}
                    {channel.seller ? channel.seller.email : "N/A"}
                  </p>
                </Card>
              ))
            ) : (
              <p>No API keys available for admin.</p>
            )}
          </div>
        </>
      ) : (
        <>
          <h2>Your Channels</h2>
          <div className="userChannels">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : userChannels.length > 0 ? (
              userChannels.map((channel) => (
                <Card
                  key={channel.id}
                  title={channel.salesChannel}
                  className="channelCard"
                  bordered={true}
                >
                  <img
                    className="logo"
                    src={channel.salesChannel === "shopify" ? shopify : woo}
                    alt={`${channel.salesChannel} Logo`}
                  />
                  <Button type="primary" onClick={() => showModal(channel)}>
                    View
                  </Button>
                </Card>
              ))
            ) : (
              <p>You have no connected channels.</p>
            )}
          </div>
        </>
      )}

      {selectedChannel && (
        <ChannelIntegrationModel
          visible={isModalVisible}
          channel={selectedChannel}
          onOk={handleOk}
          onCancel={handleCancel}
          fetchChannels={fetchChannels}
        />
      )}
    </div>
  );
};

export default ChannelIntegration;
