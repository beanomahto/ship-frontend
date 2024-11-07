import React, { useEffect, useState } from "react";
import "./ShippingSteps.css";
import step1 from "../../../utils/step1.jpg";
import step2 from "../../../utils/step2.jpg";
import step3 from "../../../utils/step3.jpg";
import step4 from "../../../utils/step4.jpg";

const ShippingSteps = () => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [step1, step2, step3, step4];

  useEffect(() => {
    // Cycle through steps every 1.5 seconds
    const interval = setInterval(() => {
      setActiveStep((prevStep) => (prevStep + 1) % steps.length);
    }, 1500);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, [steps.length]);

  const getStepImage = () => steps[activeStep];

  return (
    <div className="steps-container">
      <div className="circle-steps">
        <div className="rotating-indicator"></div>
        {/* Render step image inside the circle based on active step */}
        <img
          src={getStepImage()}
          alt={`Step ${activeStep + 1}`}
          className="step-image"
          width="80px"
        />
        {/* Steps */}
        <div className={`step step-1 ${activeStep >= 1 ? "pop-up" : ""}`}>
          <div className="step-circle">1</div>
          <p className="step-label">Sign Up</p>
        </div>
        <div className={`step step-2 ${activeStep >= 2 ? "pop-up" : ""}`}>
          <div className="step-circle">2</div>
          <p className="step-label">Complete Your KYC</p>
        </div>
        <div className={`step step-3 ${activeStep >= 3 ? "pop-up" : ""}`}>
          <div className="step-circle">3</div>
          <p className="step-label">Recharge Your Account</p>
        </div>
        <div className={`step step-4 ${activeStep >= 4 ? "pop-up" : ""}`}>
          <div className="step-circle">4</div>
          <p className="step-label">Start Shipping</p>
        </div>
      </div>
    </div>
  );
};

export default ShippingSteps;
