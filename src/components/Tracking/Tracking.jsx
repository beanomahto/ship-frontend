import React, { useEffect, useState } from "react";
import {
  Card,
  Descriptions,
  Spin,
  message,
  Row,
  Col,
  Divider,
  Typography,
  Steps,
  Progress,
} from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";

import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import EcomData from "./EcomData";
import Footer from "./Footer";
import FShipData from "./FShipData";
import Xressbees from "./Xressbees";
import SmartShipData from "./SmartShipData";

const { Title } = Typography;
const { Step } = Steps;

const Tracking = () => {
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState([]);
  const { shippingPartner, awb } = useParams();
  const [advertisement, setAdvertisement] = useState(null);
  const [advertisementLoading, setAdvertisementLoading] = useState(true);

  useEffect(() => {
    const fetchTrackingInfo = async () => {
      try {
        const splitPartners = shippingPartner.replace(/\s+/g, "");
        console.log("splitPartners", splitPartners);

        const fShipPartner = [
          "Ekart",
          "BlueDart",
          "DTDC",
          "Shadowfax",
          "Delhivery",
          "Xpressbees",
        ].includes(splitPartners);
        console.log("fShipPartner", fShipPartner);

        if (fShipPartner) {
          const response = await axios.post(
            `https://backend.shiphere.in/api/smartship/tracksmartshiporder`,
            {
              awb,
            }
          );
          setTrackingInfo(response.data);
          console.log("response", response.data);
        } else {
          //  console.log(`https://backend.shiphere.in/api/Xpressbees/track/${awb}`);
          // const response = await axios.get(`https://backend.shiphere.in/api/${shippingPartner.replace(/\s+/g, '')}/track/${awb}`);
          // if (splitPartners.toLowerCase() === "xpressbees") {
          //   const response = await axios.get(
          //     `https://backend.shiphere.in/api/xpressbees/track/${awb}`
          //   );
          //   console.log(response);
          const response = await axios.get(
            `https://backend.shiphere.in/api/${shippingPartner.replace(
              /\s+/g,
              ""
            )}/track/${awb}`
          );
          if (shippingPartner.toLowerCase() === "ecom express") {
            const response = await axios.get(
              `https://backend.shiphere.in/api/${shippingPartner.replace(
                /\s+/g,
                ""
              )}/track/${awb}`
            );
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(
              response.data.data,
              "application/xml"
            );
            const fields = xmlDoc.getElementsByTagName("field");
            const data = {};
            Array.from(fields).forEach((field) => {
              const name = field.getAttribute("name");
              const value = field.textContent.trim();
              data[name] = value;
            });
            setTrackingInfo(data);
            console.log("datttaa", data);
            console.log("responsee", response);
            updateSteps(data);
          } else {
            setTrackingInfo(response.data.trackingInfo);
            updateSteps(response.data.trackingInfo);
          }
        }
      } catch (error) {
        console.error("API error:", error);
        message.error("Error fetching tracking information.");
      } finally {
        setLoading(false);
      }
    };

    const updateSteps = (newTrackingInfo) => {
      setSteps((prevSteps) => [
        ...prevSteps,
        {
          status: newTrackingInfo.status,
          tracking_status: newTrackingInfo.tracking_status,
          updated_on: newTrackingInfo.updated_on,
        },
      ]);
    };

    const fetchAdvertisement = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://backend.shiphere.in/api/customiseTrack/get-advertisement",
          {
            headers: { Authorization: `${token}` },
          }
        );
        if (response.data) {
          const { images, description, url } = response.data;
          setAdvertisement({ images, description, url });
        }
      } catch (error) {
        console.log("No advertisement found for the user.");
      } finally {
        setAdvertisementLoading(false);
      }
    };

    fetchTrackingInfo();
    fetchAdvertisement();
  }, [awb, shippingPartner]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f0f2f5",
        }}
      >
        <Spin tip="Loading Tracking Information..." size="large" />
      </div>
    );
  }

  if (!trackingInfo) {
    return <p>No tracking information available.</p>;
  }
  console.log(trackingInfo);

  return (
    // <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    //   <div style={{ flexGrow: 1, padding: '20px', backgroundColor: '#ffffff' }}>
    //   {
    //     shippingPartner && shippingPartner.toLowerCase() === 'ecom express' ? (
    //       <EcomData trackingInfo={trackingInfo} steps={steps} />
    //     ) : (
    //         <SmartShipData trackingInfo={trackingInfo} />
    //       )

    //   }
    //   </div>
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <div
        style={{
          flexGrow: 1,
          padding: "20px",
          background: "linear-gradient(135deg, #1758b3, #0f3d73, #0b2d55)",
        }}
      >
        {shippingPartner && shippingPartner.toLowerCase() === "ecom express" ? (
          <EcomData
            trackingInfo={trackingInfo}
            steps={steps}
            // advertisement={advertisement}
          />
        ) : (
          <SmartShipData
            trackingInfo={trackingInfo}
            advertisement={advertisement}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Tracking;

// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   Descriptions,
//   Spin,
//   message,
//   Row,
//   Col,
//   Divider,
//   Typography,
//   Steps,
//   Progress,
// } from "antd";
// import axios from "axios";
// import { useParams } from "react-router-dom";

// import {
//   CheckCircleOutlined,
//   ClockCircleOutlined,
//   SyncOutlined,
//   CloseCircleOutlined,
//   CheckOutlined,
// } from "@ant-design/icons";
// import EcomData from "./EcomData";
// import Footer from "./Footer";
// import FShipData from "./FShipData";
// import Xressbees from "./Xressbees";
// import SmartShipData from "./SmartShipData";

// const { Title } = Typography;
// const { Step } = Steps;

// const Tracking = () => {
//   const [trackingInfo, setTrackingInfo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [steps, setSteps] = useState([]);
//   const { shippingPartner, awb } = useParams();

//   useEffect(() => {
//     const fetchTrackingInfo = async () => {
//       try {
//         const splitPartners = shippingPartner.replace(/\s+/g, "");
//         //console.log(splitPartners);
//         const fShipPartner = [
//           "Ekart",
//           "BlueDart",
//           "DTDC",
//           "Shadowfax",
//           "Delhivery",
//           "Xpressbees",
//         ].includes(splitPartners);
//         console.log(fShipPartner);

//         if (fShipPartner) {
//           const response = await axios.post(
//             `https://backend.shiphere.in/api/smartship/tracksmartshiporder`,
//             {
//               awb,
//             }
//           );
//           setTrackingInfo(response.data);
//           console.log("okkkkkkkkkk", response.data);
//         } else {
//           const response = await axios.get(
//             `https://backend.shiphere.in/api/${shippingPartner.replace(
//               /\s+/g,
//               ""
//             )}/track/${awb}`
//           );

//           if (shippingPartner.toLowerCase() === "ecom express") {
//             const parser = new DOMParser();
//             const xmlDoc = parser.parseFromString(
//               response.data.data,
//               "application/xml"
//             );
//             const fields = xmlDoc.getElementsByTagName("field");
//             const data = {};
//             Array.from(fields).forEach((field) => {
//               const name = field.getAttribute("name");
//               const value = field.textContent.trim();
//               data[name] = value;
//             });
//             setTrackingInfo(data);
//             //console.log(data);
//             //console.log(response)
//             updateSteps(data);
//           } else {
//             setTrackingInfo(response.data.trackingInfo);
//             updateSteps(response.data.trackingInfo);
//           }
//         }
//       } catch (error) {
//         console.error("API error:", error);
//         message.error("Error fetching tracking information.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     const updateSteps = (newTrackingInfo) => {
//       setSteps((prevSteps) => [
//         ...prevSteps,
//         {
//           status: newTrackingInfo.status,
//           tracking_status: newTrackingInfo.tracking_status,
//           updated_on: newTrackingInfo.updated_on,
//         },
//       ]);
//     };

//     fetchTrackingInfo();
//   }, [awb, shippingPartner]);

//   if (loading) {
//     return (
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//           backgroundColor: "#f0f2f5",
//         }}
//       >
//         <Spin tip="Loading Tracking Information..." size="large" />
//       </div>
//     );
//   }

//   if (!trackingInfo) {
//     return <p>No tracking information available.</p>;
//   }

//   return (
//     <div
//       style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
//     >
// <div style={{ flexGrow: 1, padding: "20px", backgroundColor: "#ffffff" }}>
//   {shippingPartner && shippingPartner.toLowerCase() === "ecom express" ? (
//     <EcomData trackingInfo={trackingInfo} steps={steps} />
//   ) : (
//     <SmartShipData trackingInfo={trackingInfo} />
//   )}
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Tracking;
