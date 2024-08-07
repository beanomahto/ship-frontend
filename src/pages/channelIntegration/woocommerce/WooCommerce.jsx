import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useChannelIntegration from "../../../hooks/useChannelIntegration";
import { message } from "antd";
import shopifyInt from "../../../utils/shopifyInt.png.jpg";
import woo from "../../../utils/woocomerce.png";

const WooCommerce = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [storeInputs, setStoreInputs] = useState({
    storeName: "",
    salesChannel: "",
    apiKey: "",
    apiSecret: "",
    token: "",
  });
  const { channelIntegration } = useChannelIntegration();

  useEffect(() => {
    const getChannelInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `https://backend-9u5u.onrender.com/api/integration/getApi/${slug}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        const result = await res.json();
        setData(result);
        setStoreInputs({
          storeName: result.storeName || "",
          salesChannel: result.salesChannel || "",
          apiKey: result.apiKey || "",
          apiSecret: result.apiSecret || "",
          token: result.token || "",
        });
      } catch (error) {
        console.error(error);
      }
    };
    getChannelInfo();
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data) {
      await updateChannelInfo();
    } else {
      await channelIntegration(storeInputs);
      message.success("Integrated Successfully");
    }
  };

  const updateChannelInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://backend-9u5u.onrender.com/api/integration/updateApi/${slug}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify(storeInputs),
        }
      );

      if (res.ok) {
        message.success("Updated Successfully");
      } else {
        const errorData = await res.json();
        const errorMessage = errorData?.message || "Failed to Update";
        message.error(errorMessage);
      }
    } catch (error) {
      console.error("Error updating channel info:", error);
      message.error("An error occurred");
    }
  };

  return (
    <div
      style={{
        marginTop: "0rem",
        display: "flex",
        background: "white",
        borderRadius: "2rem",
        gap: "2rem",
      }}
    >
      <div className="steps">
        <h1>WooCommerce</h1>
        <ol>
          <li>Go to WooCommerce Admin panel</li>
          <li>
            Go to WooCommerce {`>`} Settings {`>`} Advanced {`>`} REST API.
          </li>
          <li>Click the "Add Key" button.</li>
          <li>
            Give Description and Choose Permission to be{" "}
            <span style={{ fontWeight: "500" }}>Read/Write access.</span>
          </li>
          <li>Then click the "Generate API Key" button.</li>
          {/* <li>Next, We need some admin access for some specific APIs</li> */}

          <ul>
            <li>Consumer_key and Consumer_secret </li>
            <li>
              <span style={{ fontWeight: "600" }}>Note: </span> For Store Name
              use: https://
              <span style={{ textDecoration: "underline" }}>yourstorename</span>
              .com/wp-admin/admin
            </li>
          </ul>
        </ol>
      </div>
      <div className="inte">
        <form className="form" onSubmit={handleSubmit}>
          <p className="title">Integrate WooCommerce</p>
          <div className="flex">
            <label>
              <input
                className="input"
                type="text"
                placeholder=""
                required
                value={storeInputs.storeName}
                onChange={(e) =>
                  setStoreInputs({ ...storeInputs, storeName: e.target.value })
                }
              />
              <span>Store Name</span>
            </label>
            <label>
              <input
                className="input"
                type="text"
                placeholder=""
                required
                value={slug}
                onChange={(e) =>
                  setStoreInputs({
                    ...storeInputs,
                    salesChannel: e.target.value,
                  })
                }
              />
              <span>Channel</span>
            </label>
          </div>
          <div className="flex">
            <label>
              <input
                className="input"
                type="text"
                placeholder=""
                required
                value={slug}
                onChange={(e) =>
                  setStoreInputs({ ...storeInputs, apiKey: e.target.value })
                }
              />
              <span>Consumer Key</span>
            </label>
            <label>
              <input
                className="input"
                type="text"
                placeholder=""
                required
                value={storeInputs.apiSecret}
                onChange={(e) =>
                  setStoreInputs({ ...storeInputs, apiSecret: e.target.value })
                }
              />
              <span>Consumer Secret</span>
            </label>
          </div>
          {/* <div className="flex">
            <label>
              <input
                className="input"
                type="text"
                placeholder=""
                required
                value={storeInputs.token}
                onChange={(e) =>
                  setStoreInputs({ ...storeInputs, token: e.target.value })
                }
              />
              <span>Token</span>
            </label>
          </div> */}
          <button className="submit">
            {data ? "Update" : "Integrate"} Channel
          </button>
        </form>
      </div>
    </div>
  );
};

export default WooCommerce;
