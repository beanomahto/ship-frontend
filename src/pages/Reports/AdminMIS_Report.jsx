import React, { useState } from "react";
import { message, DatePicker, Button } from "antd";
import "./reports.css";

const AdminMIS_Report = () => {
  const [email, setEmail] = useState("");

  // Separate state for each report's date range
  const [misDates, setMisDates] = useState([null, null]);
  const [ndrDates, setNdrDates] = useState([null, null]);
  const [outForDeliveryDates, setOutForDeliveryDates] = useState([null, null]);
  const [inTransitDates, setInTransitDates] = useState([null, null]);
  const [walletDates, setWalletDates] = useState([null, null]);

  // Separate loading states for each report
  const [misLoading, setMisLoading] = useState(false);
  const [ndrLoading, setNdrLoading] = useState(false);
  const [outForDeliveryLoading, setOutForDeliveryLoading] = useState(false);
  const [inTransitLoading, setInTransitLoading] = useState(false);
  const [walletLoading, setWalletLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleMisSubmit = async (e) => {
    e.preventDefault();
    setMisLoading(true);

    // Check if dates are selected
    if (!misDates || !misDates[0] || !misDates[1]) {
      message.error("Please select both start and end dates for MIS report.");
      setMisLoading(false);
      return;
    }

    const data = {
      email,
      startDate: misDates[0].format("YYYY-MM-DD"),
      endDate: misDates[1].format("YYYY-MM-DD"),
    };

    try {
      const response = await fetch(
        "https://backend.shiphere.in/api/report/misreport",
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
        link.setAttribute("download", "orders_report.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        message.success("MIS Download successfully");
        setEmail("");
        setMisDates([null, null]);
      } else {
        message.error("Failed to download MIS");
      }
    } catch (error) {
      message.error("An error occurred while downloading MIS");
    } finally {
      setMisLoading(false);
    }
  };

  const handleNdrSubmit = async (e) => {
    e.preventDefault();
    setNdrLoading(true);

    if (!ndrDates || !ndrDates[0] || !ndrDates[1]) {
      message.error("Please select both start and end dates for NDR report.");
      setNdrLoading(false);
      return;
    }

    const data = {
      email,
      startDate: ndrDates[0].format("YYYY-MM-DD"),
      endDate: ndrDates[1].format("YYYY-MM-DD"),
    };

    try {
      const response = await fetch(
        "https://backend.shiphere.in/api/report/generatendr",
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
        setNdrDates([null, null]);
        setEmail("");
      } else {
        message.error("Failed to download NDR report.");
      }
    } catch (error) {
      message.error("An error occurred while downloading NDR report.");
    } finally {
      setNdrLoading(false);
    }
  };

  const handleOutForDeliverySubmit = async (e) => {
    e.preventDefault();
    setOutForDeliveryLoading(true);

    if (!outForDeliveryDates || !outForDeliveryDates[0] || !outForDeliveryDates[1]) {
      message.error("Please select both start and end dates for Out For Delivery report.");
      setOutForDeliveryLoading(false);
      return;
    }

    const data = {
      email,
      startDate: outForDeliveryDates[0].format("YYYY-MM-DD"),
      endDate: outForDeliveryDates[1].format("YYYY-MM-DD"),
    };

    try {
      const response = await fetch(
        "https://backend.shiphere.in/api/report/outfordelivery",
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
        setOutForDeliveryDates([null, null]);
        setEmail("");
      } else {
        message.error("Failed to download Out For Delivery report.");
      }
    } catch (error) {
      message.error("An error occurred while downloading Out For Delivery report.");
    } finally {
      setOutForDeliveryLoading(false);
    }
  };

  const handleInTransitSubmit = async (e) => {
    e.preventDefault();
    setInTransitLoading(true);

    if (!inTransitDates || !inTransitDates[0] || !inTransitDates[1]) {
      message.error("Please select both start and end dates for In Transit report.");
      setInTransitLoading(false);
      return;
    }

    const data = {
      email,
      startDate: inTransitDates[0].format("YYYY-MM-DD"),
      endDate: inTransitDates[1].format("YYYY-MM-DD"),
    };

    try {
      const response = await fetch(
        "https://backend.shiphere.in/api/report/getintransit",
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
        setInTransitDates([null, null]);
        setEmail("");
      } else {
        message.error("Failed to download In Transit report.");
      }
    } catch (error) {
      message.error("An error occurred while downloading In Transit report.");
    } finally {
      setInTransitLoading(false);
    }
  };

  const handleWalletSubmit = async (e) => {
    e.preventDefault();
    setWalletLoading(true);

    if (!walletDates || !walletDates[0] || !walletDates[1]) {
      message.error("Please select both start and end dates for Wallet report.");
      setWalletLoading(false);
      return;
    }

    const data = {
      email,
      startDate: walletDates[0].format("YYYY-MM-DD"),
      endDate: walletDates[1].format("YYYY-MM-DD"),
    };

    try {
      const response = await fetch(
        "https://backend.shiphere.in/api/report/gettranscations",
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
        link.setAttribute("download", "wallet_report.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        message.success("Wallet Report Downloaded successfully");
        setWalletDates([null, null]);
        setEmail("");
      } else {
        message.error("Failed to download Wallet report.");
      }
    } catch (error) {
      message.error("An error occurred while downloading Wallet report.");
    } finally {
      setWalletLoading(false);
    }
  };

  return (
    <div className="report-container">
      {/* MIS Report Box */}
      <div className="report-box">
        <form className="report-form" onSubmit={handleMisSubmit}>
          <h2 className="report-title">Download MIS Report</h2>
          <div className="form-group">
            <label className="form-label">
              Email Address
              <input
                className="form-input"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email"
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label className="form-label">
              Select Date Range
              <DatePicker.RangePicker
                value={misDates}
                onChange={setMisDates}
                format="YYYY-MM-DD"
                className="date-picker"
                allowClear
                required
              />
            </label>
          </div>
          <div className="btn111">
            <button className="form-button" type="submit" disabled={misLoading}>
              {misLoading ? "Downloading..." : "Submit"}
            </button>
          </div>
        </form>
      </div>

      {/* NDR Report Box */}
      <div className="report-box">
        <form className="report-form" onSubmit={handleNdrSubmit}>
          <h2 className="report-title">Download NDR Report</h2>
          <div className="form-group">
            <label className="form-label">
              Select Date Range
              <DatePicker.RangePicker
                value={ndrDates}
                onChange={setNdrDates}
                format="YYYY-MM-DD"
                className="date-picker"
                allowClear
                required
              />
            </label>
          </div>
          <div className="btn111">
            <button className="form-button" type="submit" disabled={ndrLoading}>
              {ndrLoading ? "Downloading..." : "Submit"}
            </button>
          </div>
        </form>
      </div>

      {/* Out For Delivery Report Box */}
      <div className="report-box">
        <form className="report-form" onSubmit={handleOutForDeliverySubmit}>
          <h2 className="report-title">Download Out For Delivery Report</h2>
          <div className="form-group">
            <label className="form-label">
              Select Date Range
              <DatePicker.RangePicker
                value={outForDeliveryDates}
                onChange={setOutForDeliveryDates}
                format="YYYY-MM-DD"
                className="date-picker"
                allowClear
                required
              />
            </label>
          </div>
          <div className="btn111">
            <button
              className="form-button"
              type="submit"
              disabled={outForDeliveryLoading}
            >
              {outForDeliveryLoading ? "Downloading..." : "Submit"}
            </button>
          </div>
        </form>
      </div>

      {/* In Transit Report Box */}
      <div className="report-box">
        <form className="report-form" onSubmit={handleInTransitSubmit}>
          <h2 className="report-title">Download In Transit Report</h2>
          <div className="form-group">
            <label className="form-label">
              Select Date Range
              <DatePicker.RangePicker
                value={inTransitDates}
                onChange={setInTransitDates}
                format="YYYY-MM-DD"
                className="date-picker"
                allowClear
                required
              />
            </label>
          </div>
          <div className="btn111">
            <button className="form-button" type="submit" disabled={inTransitLoading}>
              {inTransitLoading ? "Downloading..." : "Submit"}
            </button>
          </div>
        </form>
      </div>

      {/* Wallet Report Box */}
      <div className="report-box">
        <form className="report-form" onSubmit={handleWalletSubmit}>
          <h2 className="report-title">Download Wallet Report</h2>
          <div className="form-group">
            <label className="form-label">
              Select Date Range
              <DatePicker.RangePicker
                value={walletDates}
                onChange={setWalletDates}
                format="YYYY-MM-DD"
                className="date-picker"
                allowClear
                required
              />
            </label>
          </div>
          <div className="btn111">
            <button className="form-button" type="submit" disabled={walletLoading}>
              {walletLoading ? "Downloading..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminMIS_Report;
