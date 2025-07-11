import { DatePicker, message } from "antd";
import React, { useState } from "react";
import "./reports.css";

const AdminMIS_Report = () => {
  const [email, setEmail] = useState("");

  // Separate state for each report's date range
  const [misDates, setMisDates] = useState([null, null]);
  const [ndrDates, setNdrDates] = useState([null, null]);
  const [outForDeliveryDates, setOutForDeliveryDates] = useState([null, null]);
  const [inTransitDates, setInTransitDates] = useState([null, null]);
  const [walletDates, setwalletDates] = useState([null, null]);

  // Separate loading states for each report
  const [loadingMis, setLoadingMis] = useState(false);
  const [loadingNdr, setLoadingNdr] = useState(false);
  const [loadingOutForDelivery, setLoadingOutForDelivery] = useState(false);
  const [loadingInTransit, setLoadingInTransit] = useState(false);
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [loadingSeller, setLoadingSeller] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleMisSubmit = async (e) => {
    e.preventDefault();
    setLoadingMis(true);
    // Check if dates are selected
    if (!misDates || !misDates[0] || !misDates[1]) {
      message.error("Please select both start and end dates for MIS report.");
      return;
    }

    const data = {
      email,
      startDate: misDates[0].format("YYYY-MM-DD"),
      endDate: misDates[1].format("YYYY-MM-DD"),
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/report/misreport`,
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
      setLoadingMis(false);
    } catch (error) {
      message.error("An error occurred while downloading MIS");
    }
  };

  const handleNdrSubmit = async (e) => {
    e.preventDefault();
    setLoadingNdr(true);
    if (!ndrDates || !ndrDates[0] || !ndrDates[1]) {
      message.error("Please select both start and end dates for NDR report.");
      return;
    }

    const data = {
      email,
      startDate: ndrDates[0].format("YYYY-MM-DD"),
      endDate: ndrDates[1].format("YYYY-MM-DD"),
    };
    console.log("ndr", data);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/report/generatendr`,
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
      setLoadingNdr(false);
    } catch (error) {
      message.error("An error occurred while downloading NDR report.");
    }
  };

  const handleOutForDeliverySubmit = async (e) => {
    e.preventDefault();
    setLoadingOutForDelivery(true);
    if (
      !outForDeliveryDates ||
      !outForDeliveryDates[0] ||
      !outForDeliveryDates[1]
    ) {
      message.error(
        "Please select both start and end dates for Out For Delivery report."
      );
      return;
    }

    const data = {
      email,
      startDate: outForDeliveryDates[0].format("YYYY-MM-DD"),
      endDate: outForDeliveryDates[1].format("YYYY-MM-DD"),
    };
    console.log("out", data);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/report/outfordelivery`,
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
      setLoadingOutForDelivery(false);
    } catch (error) {
      message.error(
        "An error occurred while downloading Out For Delivery report."
      );
    }
  };

  // Handle In Transit Report submission
  const handleInTransitSubmit = async (e) => {
    e.preventDefault();
    setLoadingInTransit(true);
    if (!inTransitDates || !inTransitDates[0] || !inTransitDates[1]) {
      message.error(
        "Please select both start and end dates for In Transit report."
      );
      return;
    }

    const data = {
      email,
      startDate: inTransitDates[0].format("YYYY-MM-DD"),
      endDate: inTransitDates[1].format("YYYY-MM-DD"),
    };
    console.log("transit", data);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/report/getintransit`,
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
      setLoadingInTransit(false);
    } catch (error) {
      message.error("An error occurred while downloading In Transit report.");
    }
  };

  const handlewalletSubmit = async (e) => {
    e.preventDefault();
    setLoadingWallet(true);
    if (!walletDates || !walletDates[0] || !walletDates[1]) {
      message.error(
        "Please select both start and end dates for In Transit report."
      );
      return;
    }

    const data = {
      email,
      startDate: walletDates[0].format("YYYY-MM-DD"),
      endDate: walletDates[1].format("YYYY-MM-DD"),
    };
    console.log("wallet", data);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/report/gettranscations`,
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
        setInTransitDates([null, null]);
        setEmail("");
      } else {
        message.error("Failed to download Wallet report.");
      }
      setLoadingWallet(false);
    } catch (error) {
      message.error("An error occurred while downloading Wallet report.");
    }
  };
  const handleSellerSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      return message.error("Please enter an email address.");
    }

    try {
      setLoadingSeller(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/report/userdetailsexcel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ emails: [email] }), // Correct key is 'emails'
        }
      );

      if (!response.ok) {
        throw new Error(`Failed with status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Seller_Details_${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      message.success("Seller details downloaded successfully!");
    } catch (error) {
      console.error("Error downloading seller details:", error);
      message.error("Failed to download seller details.");
    } finally {
      setLoadingSeller(false);
    }
  };

  return (
    <div className="report-container" style={{ backgroundColor: "#f0f2f5" }}>
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
            <button className="form-button" type="submit" disabled={loadingMis}>
              {loadingMis ? "Downloading..." : "Submit"}
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
            <button className="form-button" type="submit" disabled={loadingNdr}>
              {loadingNdr ? "Downloading..." : "Submit"}
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
              disabled={loadingOutForDelivery}
            >
              {loadingOutForDelivery ? "Downloading..." : "Submit"}
            </button>
          </div>
        </form>
      </div>

      {/* In Transit Report Box */}
      <div className="report-box">
        <form className="report-form" onSubmit={handleInTransitSubmit}>
          <h2 className="report-title">Download Current Status Report</h2>
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
            <button
              className="form-button"
              type="submit"
              disabled={loadingInTransit}
            >
              {loadingInTransit ? "Downloading..." : "Submit"}
            </button>
          </div>
        </form>
      </div>

      <div className="report-box">
        <form className="report-form" onSubmit={handlewalletSubmit}>
          <h2 className="report-title">Download Wallet Report</h2>
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
                value={walletDates}
                onChange={setwalletDates}
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
              disabled={loadingWallet}
            >
              {loadingWallet ? "Downloading..." : "Submit"}
            </button>
          </div>
        </form>
      </div>

      {/* seller download */}
      <div className="report-box">
        <form className="report-form" onSubmit={handleSellerSubmit}>
          <h2 className="report-title">Download Seller Details</h2>
          <div className="form-group">
            <label className="form-label">
              Email Address
              <input
                className="form-input"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter seller email"
                required
              />
            </label>
          </div>
          <div className="btn111">
            <button
              className="form-button"
              type="submit"
              disabled={loadingSeller}
            >
              {loadingSeller ? "Downloading..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminMIS_Report;
