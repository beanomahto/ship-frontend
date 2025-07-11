import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useEffect, useRef, useState } from "react";
import "./LabelGenerator.css";

const getBase64ImageFromUrl = async (imageUrl) => {
  const res = await fetch(imageUrl);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const LabelGenerator = ({ orderIds }) => {
  const [labelsData, setLabelsData] = useState([]);
  const [base64Logo, setBase64Logo] = useState("");
  const labelRef = useRef(null);
  //console.log(orderIds);

  const generateLabels = async () => {
    try {
      const token = localStorage.getItem("token");
      const labels = await Promise.all(
        orderIds.map(async (orderId) => {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/shipping/getlabel/${orderId}`,
            {
              headers: {
                Authorization: `${token}`,
              },
            }
          );
          const logoBase64 = await getBase64ImageFromUrl(response.data.logoUrl);
          return { ...response.data, logoBase64 };
        })
      );
      setLabelsData(labels);
      downloadLabels(labels);
    } catch (error) {
      console.error("Error generating labels:", error.message);
      alert("Error generating labels");
    }
  };

  const downloadLabels = (labels) => {
    labels.forEach((labelData) => {
      const labelElement = document.createElement("div");
      labelElement.classList.add("label-container");
      labelElement.innerHTML = `
        <h1 style="text-align: center;">Shipping Label</h1>
        <p><strong>Order Id:-</strong> ${labelData.orderId}</p>
        <img style="width: 11rem;" src="data:image/png;base64,${labelData.barcode}" alt="Barcode" />
        <p>${labelData.shippingPartner}</p>
      `;
      document.body.appendChild(labelElement);

      html2canvas(labelElement).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "in",
          format: [4, 6],
        });
        pdf.addImage(imgData, "PNG", 0, 0, 4, 6);
        pdf.save(`shipping_label_${labelData.orderId}.pdf`);
        document.body.removeChild(labelElement);
      });
    });
  };

  useEffect(() => {
    generateLabels();
  }, [orderIds]);

  return null;
};

export default LabelGenerator;
