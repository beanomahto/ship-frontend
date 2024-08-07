import React, { useState, useEffect } from "react";
import UploadPincodes from "./uploadPincodes";
import CheckPincode from "./checkPincodes";
import './service.css'

const PincodeChecker = () => {
  return (
    <>
      <div>
        {/* <h1 className="pincode-title">Pincode Serviceability System</h1> */}
        <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '1rem',
        marginBottom: '1rem'
      }}>
        <UploadPincodes />
      </div>
        <CheckPincode />
      </div>
    </>
  );
};

export default PincodeChecker;
