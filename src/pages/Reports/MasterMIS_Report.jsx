import { DatePicker, message } from "antd";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import "./reports.css";

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

  const [walletStartDate, setwalletStartDate] = useState(null);
  const [walletEndDate, setwalletEndDate] = useState(null);

  // Separate loading states for each report
  const [loadingMis, setLoadingMis] = useState(false);
  const [loadingNdr, setLoadingNdr] = useState(false);
  const [loadingOutForDelivery, setLoadingOutForDelivery] = useState(false);
  const [loadingInTransit, setLoadingInTransit] = useState(false);
  const [loadingWallet, setLoadingWallet] = useState(false);

  const handleDownload = async () => {
    setLoadingMis(true);
    const data = { startDate: misStartDate, endDate: misEndDate };
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/report/getmisreport`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify(data),
      });

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
    } finally {
      setLoadingMis(false); // Reset loading state after download
    }
  };

  const handleDownloadNDR = async () => {
    setLoadingNdr(true);
    const data = { startDate: ndrStartDate, endDate: ndrEndDate };
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/report/getndrreport`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify(data),
      });

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
    } finally {
      setLoadingNdr(false); // Reset loading state after download
    }
  };

  const handleDownloadOutForDelivery = async () => {
    setLoadingOutForDelivery(true);
    const data = {
      startDate: outForDeliveryStartDate,
      endDate: outForDeliveryEndDate,
    };
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/report/outfordeliveryseller`,
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
    } finally {
      setLoadingOutForDelivery(false); // Reset loading state after download
    }
  };

  const handleDownloadInTransit = async () => {
    setLoadingInTransit(true);
    const data = { startDate: inTransitStartDate, endDate: inTransitEndDate };
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/report/getintransitseller`,
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
    } finally {
      setLoadingInTransit(false); // Reset loading state after download
    }
  };

  const handleDownloadWallet = async () => {
    setLoadingWallet(true);
    const data = { startDate: walletStartDate, endDate: walletEndDate };
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/report/gettranscationsseller`,
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
        link.setAttribute("download", "transaction_report.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        message.success("Transaction Report Downloaded successfully");
      } else {
        message.error("Failed to download Transaction Report");
      }
    } catch (error) {
      message.error("An error occurred while downloading Transaction Report");
    } finally {
      setLoadingWallet(false); // Reset loading state after download
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
            disabled={loadingMis}
          >
            {loadingMis ? "Downloading..." : "Submit"}
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
            disabled={loadingNdr}
          >
            {loadingNdr ? "Downloading..." : "Submit"}
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
            disabled={loadingOutForDelivery}
          >
            {loadingOutForDelivery ? "Downloading..." : "Submit"}
          </button>
        </div>
      </div>

      {/* In Transit Report */}
      <div className="report-box">
        <h2 className="report-title">Download Current Status Report</h2>
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
            disabled={loadingInTransit}
          >
            {loadingInTransit ? "Downloading..." : "Submit"}
          </button>
        </div>
      </div>

      {/* Wallet Report */}
      <div className="report-box">
        <h2 className="report-title">Download Wallet Report</h2>
        <div className="form-group">
          <label className="form-label">
            Start Date
            <DatePicker
              className="form-input date-picker"
              format="YYYY-MM-DD"
              value={walletStartDate}
              onChange={setwalletStartDate}
              placeholder="Start Date"
            />
          </label>
          <label className="form-label">
            End Date
            <DatePicker
              className="form-input date-picker"
              format="YYYY-MM-DD"
              value={walletEndDate}
              onChange={setwalletEndDate}
              placeholder="End Date"
            />
          </label>
        </div>
        <div className="btn111">
          <button
            className="form-button"
            type="button"
            onClick={handleDownloadWallet}
            disabled={loadingWallet}
          >
            {loadingWallet ? "Downloading..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminMIS_Report;
