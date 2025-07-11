import { useState } from "react";

const useChannelIntegration = () => {
  const [loading, setLoading] = useState(false);
  const [data1, setData] = useState(null);

  const channelIntegration = async ({
    storeName,
    salesChannel,
    apiKey,
    apiSecret,
    token,
  }) => {
    const success = handleInputErrors({
      storeName,
      salesChannel,
      apiKey,
      apiSecret,
      token,
    });
    if (!success) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/integration/createApi`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            storeName,
            salesChannel,
            apiKey,
            apiSecret,
            token,
          }),
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      const data = await res.json();
      setData(data);
      //console.log(data);
      if (data.error) {
        throw new Error(data.error);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, channelIntegration, data1 };
};
export default useChannelIntegration;

function handleInputErrors({
  storeName,
  salesChannel,
  apiKey,
  apiSecret,
  token,
}) {
  if (!storeName || !salesChannel || !apiKey || !apiSecret || !token) {
    alert("please fill all the inputs");
    return false;
  }

  return true;
}
