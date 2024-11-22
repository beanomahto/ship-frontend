// import React from "react";
// import { Button } from "antd";
// import axios from "axios";
// import { Helmet } from "react-helmet";

// const MasterMIS_Report = () => {
//   const handleDownload = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(
//         "https://backend.shiphere.in/api/report/getmisreport",
//         {
//           responseType: "blob",
//           headers: {
//             Authorization: `${token}`,
//           },
//         }
//       );

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", "orders_report.xlsx");
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (error) {
//       console.error("Error downloading the MIS report:", error);
//     }
//   };

//   const handleDownloadNDR = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(
//         "https://backend.shiphere.in/api/report/getndrreport",
//         {
//           responseType: "blob",
//           headers: {
//             Authorization: `${token}`,
//           },
//         }
//       );

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", "ndr_report.xlsx");
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (error) {
//       console.error("Error downloading the NDR report:", error);
//     }
//   };
//   return (
//     <div className="reportmaincontainer">
//       <Helmet>
//         <meta charSet="utf-8" />
//         <meta name="keyword" content={""} />
//         <title>MIS Report</title>
//       </Helmet>
//       <div className="reports-container">
//         <h1>Reports</h1>
//         <Button type="primary" onClick={handleDownload}>
//           Download MIS Report
//         </Button>
//       </div>
//       <div className="ndr-container">
//         <h1>NDR Reports</h1>
//         <Button type="primary" onClick={handleDownloadNDR}>
//           Download NDR Report
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default MasterMIS_Report;

import React, { useState } from "react";
import { Button, message, DatePicker } from "antd";
import { Helmet } from "react-helmet";
import "./reports.css";
import moment from "moment";

const AdminMIS_Report = () => {
  // Separate state for each report's start and end date
  const [misStartDate, setMisStartDate] = useState(null);
  const [misEndDate, setMisEndDate] = useState(null);

  const [ndrStartDate, setNdrStartDate] = useState(null);
  const [ndrEndDate, setNdrEndDate] = useState(null);

  const [outForDeliveryStartDate, setOutForDeliveryStartDate] = useState(null);
  const [outForDeliveryEndDate, setOutForDeliveryEndDate] = useState(null);

  const [inTransitStartDate, setInTransitStartDate] = useState(null);
  const [inTransitEndDate, setInTransitEndDate] = useState(null);

  const handleDownload = async () => {
    const data = { startDate: misStartDate, endDate: misEndDate };
    try {
      const response = await fetch(
        "https://backend.shiphere.in/api/report/getmisreport",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "mis_report.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        message.success("MIS Report Downloaded successfully");
      } else {
        message.error("Failed to download MIS Report");
      }
    } catch (error) {
      message.error("An error occurred while downloading MIS Report");
    }
  };

  const handleDownloadNDR = async () => {
    const data = { startDate: ndrStartDate, endDate: ndrEndDate };
    try {
      const response = await fetch(
        "https://backend.shiphere.in/api/report/getndrreport",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "ndr_report.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        message.success("NDR Report Downloaded successfully");
      } else {
        message.error("Failed to download NDR Report");
      }
    } catch (error) {
      message.error("An error occurred while downloading NDR Report");
    }
  };

  const handleDownloadOutForDelivery = async () => {
    const data = {
      startDate: outForDeliveryStartDate,
      endDate: outForDeliveryEndDate,
    };
    try {
      const response = await fetch(
        "https://backend.shiphere.in/api/report/outfordeliveryseller",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "out_for_delivery_report.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        message.success("Out For Delivery Report Downloaded successfully");
      } else {
        message.error("Failed to download Out For Delivery Report");
      }
    } catch (error) {
      message.error(
        "An error occurred while downloading Out For Delivery Report"
      );
    }
  };

  const handleDownloadInTransit = async () => {
    const data = { startDate: inTransitStartDate, endDate: inTransitEndDate };
    try {
      const response = await fetch(
        "https://backend.shiphere.in/api/report/getintransitseller",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "in_transit_report.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        message.success("In Transit Report Downloaded successfully");
      } else {
        message.error("Failed to download In Transit Report");
      }
    } catch (error) {
      message.error("An error occurred while downloading In Transit Report");
    }
  };

  return (
    <div className="report-container">
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="keyword" content={""} />
        <title>Reports</title>
      </Helmet>

      {/* MIS Report */}
      <div className="report-box">
        <h2 className="report-title">Download MIS Report</h2>
        <div className="form-group">
          <label className="form-label">
            Start Date
            <DatePicker
              className="form-input date-picker"
              format="YYYY-MM-DD"
              value={misStartDate}
              onChange={setMisStartDate}
              placeholder="Start Date"
            />
          </label>
          <label className="form-label">
            End Date
            <DatePicker
              className="form-input date-picker"
              format="YYYY-MM-DD"
              value={misEndDate}
              onChange={setMisEndDate}
              placeholder="End Date"
            />
          </label>
        </div>
        <div className="btn111">
          <button
            className="form-button"
            type="button"
            onClick={handleDownload}
          >
            Submit
          </button>
        </div>
      </div>

      {/* NDR Report */}
      <div className="report-box">
        <h2 className="report-title">Download NDR Report</h2>
        <div className="form-group">
          <label className="form-label">
            Start Date
            <DatePicker
              className="form-input date-picker"
              format="YYYY-MM-DD"
              value={ndrStartDate}
              onChange={setNdrStartDate}
              placeholder="Start Date"
            />
          </label>
          <label className="form-label">
            End Date
            <DatePicker
              className="form-input date-picker"
              format="YYYY-MM-DD"
              value={ndrEndDate}
              onChange={setNdrEndDate}
              placeholder="End Date"
            />
          </label>
        </div>
        <div className="btn111">
          <button
            className="form-button"
            type="button"
            onClick={handleDownloadNDR}
          >
            Submit
          </button>
        </div>
      </div>

      {/* Out For Delivery Report */}
      <div className="report-box">
        <h2 className="report-title">Download Out For Delivery Report</h2>
        <div className="form-group">
          <label className="form-label">
            Start Date
            <DatePicker
              className="form-input date-picker"
              format="YYYY-MM-DD"
              value={outForDeliveryStartDate}
              onChange={setOutForDeliveryStartDate}
              placeholder="Start Date"
            />
          </label>
          <label className="form-label">
            End Date
            <DatePicker
              className="form-input date-picker"
              format="YYYY-MM-DD"
              value={outForDeliveryEndDate}
              onChange={setOutForDeliveryEndDate}
              placeholder="End Date"
            />
          </label>
        </div>
        <div className="btn111">
          <button
            className="form-button"
            type="button"
            onClick={handleDownloadOutForDelivery}
          >
            Submit
          </button>
        </div>
      </div>

      {/* In Transit Report */}
      <div className="report-box">
        <h2 className="report-title">Download In Transit Report</h2>
        <div className="form-group">
          <label className="form-label">
            Start Date
            <DatePicker
              className="form-input date-picker"
              format="YYYY-MM-DD"
              value={inTransitStartDate}
              onChange={setInTransitStartDate}
              placeholder="Start Date"
            />
          </label>
          <label className="form-label">
            End Date
            <DatePicker
              className="form-input date-picker"
              format="YYYY-MM-DD"
              value={inTransitEndDate}
              onChange={setInTransitEndDate}
              placeholder="End Date"
            />
          </label>
        </div>
        <div className="btn111">
          <button
            className="form-button"
            type="button"
            onClick={handleDownloadInTransit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminMIS_Report;
