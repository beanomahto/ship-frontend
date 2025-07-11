
import React, { useEffect, useState } from "react";
import LineChart from "../../../components/Chart/LineChart";
import "./Dashboard.css";
import { MdAutorenew } from "react-icons/md";

const DashboardTab = ({ dataSource }) => {
  const [attemptsCount, setAttemptsCount] = useState({
    attempt1: 0,
    attempt2: 0,
    attempt3: 0,
  });
  const undelivered = dataSource?.filter(
    (dataSource) => dataSource.status === "UnDelivered"
  );
  // console.log(undelivered);

  useEffect(() => {
    const calculateAttempts = () => {
      const undelivered = dataSource?.filter(
        (dataSource) => dataSource.status === "UnDelivered"
      );
      // console.log(undelivered);

      // Initialize a temporary counter for attempts
      const tempCount = { attempt1: 0, attempt2: 0, attempt3: 0 };

      undelivered.forEach((order) => {
        // Assuming `reasonChangeCount` is tracked based on how many times the reason changes
        // Add a `reasonChangeCount` field to each undelivered order if it doesn't exist
        if (!order.reasonChangeCount) {
          order.reasonChangeCount = 1; // Initial attempt
        }

        // Count attempts based on the `reasonChangeCount`
        if (order.reasonChangeCount === 1) tempCount.attempt1 += 1;
        else if (order.reasonChangeCount === 2) tempCount.attempt2 += 1;
        else if (order.reasonChangeCount >= 3) tempCount.attempt3 += 1;
      });

      setAttemptsCount(tempCount);
    };

    calculateAttempts();
  }, [dataSource]);

  // Function to simulate reason field changes and increase reasonChangeCount
  const updateReasonChangeCount = (orderId, newReason) => {
    const updatedDataSource = dataSource.map((order) => {
      if (order._id === orderId) {
        if (order.reason !== newReason) {
          order.reason = newReason;
          order.reasonChangeCount = (order.reasonChangeCount || 1) + 1;
        }
      }
      return order;
    });

    calculateAttempts();
  };

  return (
    <div className="dashboard-container">
    <div className="orderSummaryContainer">
      {[
        { count: attemptsCount.attempt1, label: "Attempt 1", color: "#2B3FE5" },
        { count: attemptsCount.attempt2, label: "Attempt 2", color: "#FD8787" },
        { count: attemptsCount.attempt3, label: "Attempt 3", color: "#FAC013" }
      ].map((attempt, index) => (
        <div className="orderSummaryCard" key={index}>
          <div className="orderSummary">
            <h3>{attempt.count}</h3>
            <p>{attempt.label}</p>
          </div>
          <div className="orderIcon">
            <MdAutorenew size={40} color={attempt.color} />
          </div>
        </div>
      ))}
    </div>
  </div>
  );
};

export default DashboardTab;
