import React, { useState } from "react";
import { message, DatePicker, Button } from "antd";

const AdminMIS_Report = () => {
  const [email, setEmail] = useState("");
  const [dates, setDates] = useState([null, null]); // state to hold the selected date range

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleDateChange = (value) => {
    setDates(value); // Directly update the state with selected moment objects
  };
  const handleMisSubmit = async (e) => {
    e.preventDefault();

    const data = {
      email,
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
      } else {
        message.error("Failed to download MIS");
      }
    } catch (error) {
      message.error("An error occurred while downloading MIS");
    }
  };

  const handleNdrSubmit = async (e) => {
    e.preventDefault();

    // Validate and format dates
    if (!dates || !dates[0] || !dates[1]) {
      message.error("Please select both start and end dates.");
      return;
    }

    const startDate = dates[0].format("YYYY-MM-DD"); // Correctly format the start date
    const endDate = dates[1].format("YYYY-MM-DD"); // Correctly format the end date

    const data = {
      email,
      startDate,
      endDate,
    };

    console.log("Data to send:", data); // Debug the data being sent

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
        setEmail("");
        setDates([null, null]); // Reset dates after submission
      } else {
        message.error("Failed to download NDR report.");
      }
    } catch (error) {
      message.error("An error occurred while downloading NDR report.");
    }
  };

  return (
    <div>
      <div className="formConsprt">
        <form className="formsprt" onSubmit={handleMisSubmit}>
          <p className="titlesprt">Download MIS Report</p>
          <div className="flex2sprt">
            <div className="flexsprt">
              <label className="iptsprt">
                <span>Email</span>
                <input
                  className="inputsprt"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
              </label>
            </div>
          </div>
          <button className="submitsprt" type="submit">
            Submit
          </button>
        </form>
      </div>

      <div className="formConsprt">
        <form className="formsprt" onSubmit={handleNdrSubmit}>
          <p className="titlesprt">Download NDR Report</p>
          <div className="flex2sprt">
            <div className="flexsprt">
              <label className="iptsprt">
                <span>Email</span>
                <input
                  className="inputsprt"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
              </label>
            </div>
          </div>

          {/* Date Range Picker */}
          <div className="flex2sprt">
            <div className="flexsprt">
              <label className="iptsprt">
                <span>Select Date Range</span>
                <DatePicker.RangePicker
                  value={dates}
                  onChange={handleDateChange}
                  format="YYYY-MM-DD"
                  allowClear
                  required
                />
              </label>
            </div>
          </div>

          <button className="submitsprt" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminMIS_Report;
