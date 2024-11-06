// import React from 'react';
// import LineChart from '../../../components/Chart/LineChart';

// const DashboardTab = ({dataSource}) => (
//   console.log(dataSource);
//   <div style={{ width: '70%', height: '40%', margin: '0 auto' }}>
//     <LineChart />
//   </div>
// );

// export default DashboardTab;
import React from "react";
import LineChart from "../../../components/Chart/LineChart";

const DashboardTab = ({ dataSource }) => {
  return (
    <div style={{ width: "70%", height: "40%", margin: "0 auto" }}>
      <LineChart dataSource={dataSource} />
    </div>
  );
};

export default DashboardTab;
