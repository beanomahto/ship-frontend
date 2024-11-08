import React from "react";
import { Button } from "antd";
import axios from "axios";
import { Helmet } from "react-helmet";

const MasterMIS_Report = () => {
  const handleDownload = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/report/getmisreport",
        {
          responseType: "blob",
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "orders_report.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading the MIS report:", error);
    }
  };

  const handleDownloadNDR = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/report/getndrreport",
        {
          responseType: "blob",
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ndr_report.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading the NDR report:", error);
    }
  };
  return (
    <div className="reportmaincontainer">
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="keyword" content={""} />
        <title>MIS Report</title>
      </Helmet>
      <div className="reports-container">
        <h1>Reports</h1>
        <Button type="primary" onClick={handleDownload}>
          Download MIS Report
        </Button>
      </div>
      <div className="ndr-container">
        <h1>NDR Reports</h1>
        <Button type="primary" onClick={handleDownloadNDR}>
          Download NDR Report
        </Button>
      </div>
    </div>
  );
};

export default MasterMIS_Report;
