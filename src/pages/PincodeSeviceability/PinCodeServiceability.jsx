import React, { useState, useEffect } from "react";
import UploadPincodes from "./uploadPincodes";
import CheckPincode from "./checkPincodes";

const PincodeChecker = () => {
  return (
    <>
      <div>
        <h1>Pincode Serviceability System</h1>
        <UploadPincodes />
        <CheckPincode />
      </div>
    </>
  );
};

export default PincodeChecker;
