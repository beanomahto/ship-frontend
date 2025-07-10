import React, { useEffect, useState } from "react";

const ViewShopify = () => {
  //   const { slug } = useParams();
  const slug = "shopify";
  const [data, setData] = useState(null);
  const [storeInputs, setStoreInputs] = useState({
    storeName: "",
    salesChannel: slug,
    apiKey: "",
    apiSecret: "",
    token: "",
  });

  useEffect(() => {
    const getChannelInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.url}/api/integration/getApi/${slug}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        const result = await res.json();
        //console.log(result);

        if (result.storeName) {
          setData(result);
          setStoreInputs({
            storeName: result.storeName || "",
            salesChannel: result.salesChannel || "",
            apiKey: result.apiKey || "",
            apiSecret: result.apiSecret || "",
            token: result.token || "",
          });
        } else {
          console.error("Invalid response or API key not found");
        }
      } catch (error) {
        console.error("Error fetching channel info:", error);
      }
    };

    getChannelInfo();
  }, [slug]);
  //console.log(data);
  return (
    <div
      style={{
        marginTop: "0rem",
        display: "flex",
        background: "white",
        borderRadius: "2rem",
        padding: "20px",
      }}
    >
      <div className="steps">
        <h1>{data ? data.storeName : "Loading..."}</h1>
        <ol>
          <li>Login with Shopify Admin panel</li>
          <li>Go to Apps</li>
          <li>Scroll down to find Manage Private App use</li>
          <li>Click on create new Private app</li>
          <li>Give your private app a name, e.g., Shiphere</li>
          <li>We need some admin access for specific APIs</li>
          <ul>
            <li>
              <span style={{ fontWeight: "600" }}>Read Access: </span>
              Fulfillment Service & Inventory{" "}
            </li>
            <li>
              <span style={{ fontWeight: "600" }}>Read & Write Access: </span>
              Products, Products Listing, Assigned Fulfillment Orders,
              Customers, Orders, Merchant Managed Fulfilled Orders, Order
              Editing, Store Content, Third Party Fulfillment Orders{" "}
            </li>
          </ul>
          <li>
            Click <span style={{ fontWeight: "600" }}>Install app</span>
          </li>
          <li>Save Your changes to get Credentials</li>
          <ul>
            <li>API Key, API Secret, Token</li>
            <li>
              <span style={{ fontWeight: "600" }}>Note: </span> For Store Name
              use: https://
              <span style={{ textDecoration: "underline" }}>yourstorename</span>
              .myshopify.com
            </li>
          </ul>
        </ol>
      </div>

      <div className="inte" style={{ marginTop: "0rem" }}>
        <form className="form">
          <p className="title">Your Shopify Channel</p>
          <div className="flex">
            <label>
              <input
                className="input"
                type="text"
                placeholder=""
                required
                value={storeInputs.storeName}
                onChange={(e) =>
                  setStoreInputs({
                    ...storeInputs,
                    storeName: e.target.value,
                  })
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
                value={storeInputs.apiKey}
                onChange={(e) =>
                  setStoreInputs({ ...storeInputs, apiKey: e.target.value })
                }
              />
              <span>API Key</span>
            </label>
            <label>
              <input
                className="input"
                type="text"
                placeholder=""
                required
                value={storeInputs.apiSecret}
                onChange={(e) =>
                  setStoreInputs({
                    ...storeInputs,
                    apiSecret: e.target.value,
                  })
                }
              />
              <span>API Secret</span>
            </label>
          </div>
          <div className="flex">
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default ViewShopify;
