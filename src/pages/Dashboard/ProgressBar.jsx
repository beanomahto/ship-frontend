import React from 'react';
import './ProgressBar.css'; 

const ProgressBar = ({ data }) => {
  return (
    <div className="progress-bar-container">
      {data.map((item, index) => (
        <div
          key={index}
          className="progress-bar-segment"
          style={{
            width: `${item.percentage}%`,
            backgroundColor: item.color,
          }}
          title={`${item.state}: ${item.percentage}%`}
        >
          {/* <span className="progress-bar-label">{item.percentage}%</span> */}
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
