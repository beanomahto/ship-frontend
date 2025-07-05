import { message, Spin, Steps, Typography } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import EcomData from "./EcomData";
import Footer from "./Footer";
import MarutiData from "./MarutiData";
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

        if (fShipPartner) {
          const response = await axios.post(
            `http://localhost:5000/api/smartship/tracksmartshiporder`,
            { awb }
          );
          setTrackingInfo(response.data);
          updateSteps(response.data);
        } else if (splitPartners.toLowerCase() === "amazonshipping") {
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
          setTrackingInfo(payload); // this is what contains the actual data
          console.log("Amazon tracking data", payload);

          // Use eventHistory for steps
          if (Array.isArray(payload.eventHistory)) {
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
        } else if (shippingPartner.toLowerCase() === "ecom express") {
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
          updateSteps(data);
        } else {
          const response = await axios.get(
            `http://localhost:5000/api/${splitPartners}/track/${awb}`
          );
          const data = response.data.data.data;
          data.awb_number = awb;
          setTrackingInfo(data);
          updateSteps(data);
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
          "http://localhost:5000/api/customiseTrack/get-advertisement",
          {
            headers: { Authorization: `${token}` },
          }
        );

        if (response.data) {
          const { images, description, url } = response.data;
          setAdvertisement({ images, description, url });
        } else {
          console.log("No advertisement data found.");
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
        ) : shippingPartner?.toLowerCase() === "maruti" ? (
          <MarutiData
            trackingInfo={trackingInfo}
            advertisement={advertisement}
          />
        ) : (
          <>
            <SmartShipData
              trackingInfo={trackingInfo}
              advertisement={advertisement}
            />
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
