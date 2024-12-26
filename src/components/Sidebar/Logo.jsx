// import React from 'react'
// // import {  ChromeFilled } from '@ant-design/icons'/
// import Ship from '../../utils/logo.png'

// const Logo = () => {
//   return (
//     <div className='logo'>
//       <div className="logo-icon">
//         {/* < ChromeFilled  /> */}
//       {/* <Ship/> */}
//       <img src={Ship} alt="" width={50} height={50} style={{border:'2px solid #ddd', borderRadius:'20%'}} />
//       </div>
//     </div>
//   )
// }

// export default Logo

import React from "react";
import Ship from "../../utils/logo.png";

const Logo = ({ collapsed }) => {
  // Determine the size of the logo based on whether the sidebar is collapsed
  const size = collapsed ? 45 : 65;

  return (
    <div
      className="logo"
      style={{
        display: "flex",
        justifyContent: "center", // Center horizontally
        width: "100%", // Take full width of the sidebar
      }}
    >
      <div className="logo-icon">
        <img
          src={Ship}
          alt="Logo"
          width={size}
          height={size}
          style={{
            // border: "2px solid #ddd",
            borderRadius: "10%",
            transition: "all 0.3s ease", // Smooth resizing effect
          }}
        />
      </div>
    </div>
  );
};

export default Logo;
