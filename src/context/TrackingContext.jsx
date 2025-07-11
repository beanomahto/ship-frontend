
import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { message, Spin } from "antd";
import axios from "axios";

export const TrackingContext = createContext();

export const useTrackingContext = () => useContext(TrackingContext);

export const TrackingContextProvider = ({ children }) => {
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { awb } = useParams(); // we no longer need `shippingPartner`

  const fetchTrackingInfo = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/deliveryOne/track/${awb}`
      );
      setTrackingInfo(response.data.trackingInfo);
    } catch (error) {
      console.error("Delhivery API error:", error);
      message.error("Error fetching tracking information from Delhivery.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (awb) {
      fetchTrackingInfo();
    }
  }, [awb]);

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

  return (
    <TrackingContext.Provider
      value={{ trackingInfo, setTrackingInfo, fetchTrackingInfo }}
    >
      {children}
    </TrackingContext.Provider>
  );
};
