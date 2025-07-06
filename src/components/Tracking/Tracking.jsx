import { message, Spin, Steps, Typography } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import EcomData from "./EcomData";
import Footer from "./Footer";
import MarutiData from "./MarutiData";
import SmartShipData from "./SmartShipData";
import DelhiveryData from "./DelhiveryData";
import AmazonData from "./AmazonData";

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
        const lowerPartner = splitPartners.toLowerCase();

        const fShipPartner = [
          "Ekart",
          "BlueDart",
          "DTDC",
          "Shadowfax",
          "Xpressbees",
        ]
          .map((p) => p.toLowerCase())
          .includes(lowerPartner);

        if (fShipPartner) {
          const response = await axios.post(
            `http://localhost:5000/api/smartship/tracksmartshiporder`,
            { awb }
          );
          console.log("Delhivery response\n", response.data);

          setTrackingInfo(response.data);
        } else if (lowerPartner === "amazonshipping") {
          const response = await axios.get(
            "http://localhost:5000/api/amazon/track",
            {
              params: {
                carrierID: "ATS",
                trackingID: awb,
              },
            }
          );

          const payload = response.data.payload;
          const info = {
            ...payload,
            trackingId: payload.trackingId,
            orderedOn: payload.eventHistory?.[0]?.eventTime || null,
            expectedDelivery: payload.promisedDeliveryDate || null,
          };
          setTrackingInfo(info);
          console.log("Amazon tracking info", info);
          // setTrackingInfo(payload); // this is what contains the actual data
          // console.log("Amazon tracking data", payload);

          if (
            Array.isArray(payload.eventHistory) &&
            payload.eventHistory.length > 0
          ) {
            const stepList = payload.eventHistory.map((event) => ({
              status: payload.summary?.status || "In Transit",
              tracking_status: event.eventCode,
              updated_on: event.eventTime,
            }));
            setSteps(stepList);
          } else {
            setSteps([
              {
                status: payload.summary?.status || "Unknown",
                tracking_status: "No Tracking Events",
                updated_on: payload.promisedDeliveryDate || "N/A",
              },
            ]);
          }
        } else if (lowerPartner === "delhivery") {
          const response = await axios.get(
            `http://localhost:5000/api/deliveryOne/track/${awb}`
          );
          const data = response.data.data.data;
          data.awb_number = awb;
          setTrackingInfo(data);
        } else if (lowerPartner === "ecomexpress") {
          const response = await axios.get(
            `http://localhost:5000/api/${splitPartners}/track/${awb}`
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
        } else if (lowerPartner === "shreemaruti") {
          const response = await axios.get(
            `http://localhost:5000/api/maruti/track/${awb}`
          );
          const data = response.data.data.data;
          data.awb_number = awb;
          setTrackingInfo(data);
        } else {
          const response = await axios.get(
            `http://localhost:5000/api/${splitPartners}/track/${awb}`
          );
          const data = response.data.data.data;
          data.awb_number = awb;
          setTrackingInfo(data);
        }
      } catch (error) {
        console.error("API error:", error);
        message.error("Error fetching tracking information.");
      } finally {
        setLoading(false);
      }
    };

    const fetchAdvertisement = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/customiseTrack/get-advertisement",
          {
            headers: { Authorization: `${token}` },
          }
        );

        if (response.data) {
          const { images, description, url } = response.data;
          setAdvertisement({ images, description, url });
        }
      } catch (error) {
        console.error("Error fetching advertisement:", error);
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

  return (
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
        {shippingPartner?.toLowerCase() === "ecom express" ? (
          <EcomData
            trackingInfo={trackingInfo}
            steps={steps}
            advertisement={advertisement}
          />
        ) : shippingPartner?.toLowerCase() === "delhivery" ? (
          <DelhiveryData
            trackingInfo={trackingInfo}
            advertisement={advertisement}
          />
        ) : shippingPartner?.toLowerCase() === "shree maruti" ? (
          <MarutiData
            trackingInfo={trackingInfo}
            advertisement={advertisement}
          />
        ) : shippingPartner?.toLowerCase() === "amazon shipping" ? (
          <AmazonData
            trackingInfo={trackingInfo}
            advertisement={advertisement}
          />
        ) : (
          <>
            <SmartShipData
              trackingInfo={trackingInfo}
              advertisement={advertisement}
            />
            {console.log("shippingPartner", shippingPartner)}
            {steps?.length > 0 && (
              <div style={{ marginTop: 32 }}>
                <Steps direction="vertical" current={steps.length - 1}>
                  {steps.map((step, index) => (
                    <Step
                      key={index}
                      title={step.tracking_status}
                      description={step.updated_on}
                    />
                  ))}
                </Steps>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Tracking;
