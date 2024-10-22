import React from "react";
import "./ProgressBar.css";

const ProgressBar = ({ data }) => {
  return (
    <div className="progress-bar-container">
      {data.map((item, index) => (
        <div
          key={index}
          className="progress-bar-segment"
          style={{
            width: `${item.percentage > 0 ? item.percentage : 0}%`, // Ensure percentage is valid
            backgroundColor: item.color,
          }}
          title={`${item.state}: ${item.percentage > 0 ? item.percentage : 0}%`} // Show 0% if there's no data
        >
          {item.percentage > 0 && ( // Only show label if percentage > 0
            <span className="progress-bar-label">{item.percentage}%</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
