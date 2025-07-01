import { message } from "antd";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import './shopify.css';

const Shopify = () => {
  const params = useParams();
  const slug = "shopify";

  const [data, setData] = useState(null);
  const [storeInputs, setStoreInputs] = useState({
    storeName: "",
    salesChannel: slug,
    apiKey: "",
    apiSecret: "",
    token: "",
  });

//   useEffect(() => {
//     const getChannelInfo = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await fetch(
//           `https://backend.shiphere.in/api/integration/getApi/${slug}`,
//           {
//             headers: {
//               Authorization: `${token}`,
//             },
//           }
//         );
//         const result = await res.json();
//   //console.log(result);
  
//         if (result.storeName) {
//           setData(result);
//           setStoreInputs({
//             storeName: result.storeName || "",
//             salesChannel: result.salesChannel || "",
//             apiKey: result.apiKey || "",
//             apiSecret: result.apiSecret || "",
//             token: result.token || "",
//           });
//         } else {
//           console.error("Invalid response or API key not found");
//         }
//       } catch (error) {
//         console.error("Error fetching channel info:", error);
//       }
//     };
  
//     getChannelInfo();
//   }, [slug]);
// //console.log(data);

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (data === null) {
      await integrateShopifyChannel();
      setStoreInputs({
        storeName: "",
        salesChannel: slug,
        apiKey: "",
        apiSecret: "",
        token: "",
      });
      message.success("Channel created successfully");
    }
  } catch (error) {
    message.error("An error occurred while integrating the channel");
  }
};

  //console.log(storeInputs);
  
  const integrateShopifyChannel = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/integration/createApi`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify(storeInputs),
        }
      );
    //console.log(storeInputs);
    //console.log(await res.json());
  
      // if (!res.ok) {
      //   throw new Error("Failed to create the channel");
      // }
    } catch (error) {
      console.error("Error integrating Shopify channel:", error);
      throw error;
    }
  };

  const updateChannelInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/integration/updateApi/${slug}`,
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
        message.success("Channel updated successfully");
      } else {
        const errorData = await res.json();
        const errorMessage = errorData?.message || "Failed to update channel";
        message.error(errorMessage);
      }
    } catch (error) {
      console.error("Error updating channel info:", error);
      message.error("An error occurred while updating the channel");
    }
  };
  return (
    <div
     className="mainIntegrationHeader"
    >
      <div className="steps">
        <h1>Shopify</h1>
        <ol>
          <li>Login with Shopify Admin panel</li>
          <li>Go to Apps</li>
          <li>Scroll down to find Manage Private App use</li>
          <li>here, click on create new Private app</li>
          <li>Go ahead and give your private app name. For eg. Shiphere</li>
          <li>Next, We need some admin access for some specific APIs</li>
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
        <form className="form" onSubmit={handleSubmit}>
          <p className="title">Integrate</p>
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
          <button className="submit">
            {data ? "Update" : "Integrate"} Channel
          </button>
        </form>
      </div>
    </div>
  );
};

export default Shopify;
