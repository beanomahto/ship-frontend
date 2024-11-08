import { Link, useNavigate } from "react-router-dom";
import { Checkbox, Button, Input } from "antd";
import React, { useState, useRef } from "react";
import useSignup from "../../hooks/useSignup";
import { useOrderContext } from "../../context/OrderContext";
import imgg from "../../utils/new.png";
import { MdCheckCircle } from "react-icons/md";

const Signup1 = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    phoneNumber: "",
    password: "",
    otp: "",
  });

  const [fieldFilled, setFieldFilled] = useState({
    firstName: false,
    lastName: false,
    companyName: false,
    email: false,
    phoneNumber: false,
    password: false,
  });

  const [otpArray, setOtpArray] = useState(new Array(6).fill(""));
  const [agree, setAgree] = useState(false);
  const { loading, signup } = useSignup();
  const { fetchOrders } = useOrderContext();
  const [phoneError, setPhoneError] = useState("");
  const [isOtpButtonDisabled, setIsOtpButtonDisabled] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);

  const otpRefs = useRef(new Array(6).fill(null));

  const validatePhoneNumber = (phoneNumber) => /^[0-9]{10}$/.test(phoneNumber);

  const handleInputChange = (field, value) => {
    setInputs({ ...inputs, [field]: value });
    setFieldFilled((prev) => ({ ...prev, [field]: value.trim() !== "" }));
  };

  const handlePhoneNumberChange = (e) => {
    const { value } = e.target;
    handleInputChange("phoneNumber", value);
    if (!validatePhoneNumber(value)) {
      setPhoneError("Please enter a valid 10-digit phone number.");
    } else {
      setPhoneError("");
    }
  };

  const handleOTPChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value)) {
      const newOtpArray = [...otpArray];
      newOtpArray[index] = value;
      setOtpArray(newOtpArray);
      setInputs({ ...inputs, otp: newOtpArray.join("") });

      if (index < 5 && value) {
        otpRefs.current[index + 1].focus();
      }
    }
  };

  const handleOTPKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtpArray = [...otpArray];
      if (!otpArray[index] && index > 0) {
        otpRefs.current[index - 1].focus();
      }
      newOtpArray[index] = "";
      setOtpArray(newOtpArray);
      setInputs({ ...inputs, otp: newOtpArray.join("") });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phoneError) {
      return;
    }

    try {
      await signup(inputs);
      fetchOrders();
      navigate("/");
    } catch (error) {
      console.error("Signup failed", error);
    }
  };

  const handleSendOtp = async () => {
    if (inputs.email) {
      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/sendOtp",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: inputs.email,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to send OTP");
        }

        const result = await response.json();
        console.log("OTP sent successfully:", result);

        setIsOtpButtonDisabled(true);
        let timeLeft = 30;
        setOtpTimer(timeLeft);

        const timerInterval = setInterval(() => {
          timeLeft -= 1;
          setOtpTimer(timeLeft);

          if (timeLeft === 0) {
            setIsOtpButtonDisabled(false);
            clearInterval(timerInterval);
          }
        }, 1000);
      } catch (error) {
        console.error("Error sending OTP:", error);
      }
    }
  };

  return (
    <div className="section">
      <div className="imgBx">
        <img src={imgg} alt="Background" />
      </div>
      <div className="contentBx">
        <div className="formBx">
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="inputBx">
              <label htmlFor="firstName">First Name</label>
              <div classname="inputContainer" style={{ display: "flex" }}>
                <input
                  type="text"
                  id="firstName"
                  placeholder="First Name"
                  value={inputs.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                />
                {fieldFilled.firstName && (
                  <MdCheckCircle
                    size={27}
                    style={{
                      color: "green",
                      marginLeft: "8px",
                      marginTop: "5px",
                    }}
                  />
                )}
              </div>
            </div>
            <div className="inputBx">
              <label htmlFor="lastName">Last Name</label>
              <div classname="inputContainer" style={{ display: "flex" }}>
                <input
                  type="text"
                  id="lastName"
                  placeholder="Last Name"
                  value={inputs.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                />
                {fieldFilled.lastName && (
                  <MdCheckCircle
                    size={27}
                    style={{
                      color: "green",
                      marginLeft: "8px",
                      marginTop: "5px",
                    }}
                  />
                )}
              </div>
            </div>
            <div className="inputBx">
              <label htmlFor="companyName">Company Name</label>
              <div classname="inputContainer" style={{ display: "flex" }}>
                <input
                  type="text"
                  id="companyName"
                  placeholder="Company Name"
                  value={inputs.companyName}
                  onChange={(e) =>
                    handleInputChange("companyName", e.target.value)
                  }
                />
                {fieldFilled.companyName && (
                  <MdCheckCircle
                    size={27}
                    style={{
                      color: "green",
                      marginLeft: "8px",
                      marginTop: "5px",
                    }}
                  />
                )}
              </div>
            </div>
            <div className="inputBx">
              <label htmlFor="email">Email</label>
              <div classname="inputContainer" style={{ display: "flex" }}>
                <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  value={inputs.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
                {fieldFilled.email && (
                  <MdCheckCircle
                    size={27}
                    style={{
                      color: "green",
                      marginLeft: "8px",
                      marginTop: "5px",
                    }}
                  />
                )}
              </div>
            </div>

            <div className="otpSection">
              <Button
                onClick={handleSendOtp}
                disabled={!inputs.email || isOtpButtonDisabled}
                type="primary"
              >
                {isOtpButtonDisabled
                  ? `Resend OTP in ${otpTimer}s`
                  : "Send OTP"}
              </Button>
              <div className="otpContainer">
                {otpArray.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    value={digit}
                    onChange={(e) => handleOTPChange(e, index)}
                    onKeyDown={(e) => handleOTPKeyDown(e, index)}
                    maxLength={1}
                    className="otpBox"
                  />
                ))}
              </div>
            </div>

            <div className="inputBx">
              <label htmlFor="phoneNumber">Phone No.</label>
              <div classname="inputContainer" style={{ display: "flex" }}>
                <input
                  type="text"
                  id="phoneNumber"
                  placeholder="Phone No."
                  value={inputs.phoneNumber}
                  onChange={handlePhoneNumberChange}
                />
                {fieldFilled.phoneNumber && !phoneError && (
                  <MdCheckCircle
                    size={27}
                    style={{
                      color: "green",
                      marginLeft: "8px",
                      marginTop: "5px",
                    }}
                  />
                )}
              </div>
              {phoneError && <span style={{ color: "red" }}>{phoneError}</span>}
            </div>
            <div className="inputBx">
              <label htmlFor="password">Password</label>
              <div classname="inputContainer" style={{ display: "flex" }}>
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={inputs.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                />
                {fieldFilled.password && (
                  <MdCheckCircle
                    size={27}
                    style={{
                      color: "green",
                      marginLeft: "8px",
                      marginTop: "5px",
                    }}
                  />
                )}
              </div>
            </div>
            <div className="terms">
              <Checkbox
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                style={{
                  marginTop: "2rem",
                  marginBottom: "1rem",
                  marginLeft: "3rem",
                }}
              >
                I agree to the{" "}
                <Link
                  to="/terms-and-conditions"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms and Conditions
                </Link>
              </Checkbox>
            </div>

            <div className="inputBx">
              <input
                type="submit"
                value="Signup"
                disabled={!agree || loading || phoneError}
              />
            </div>
            <div className="inputBx">
              <p>
                Already have an account? <Link to="/login">Click here!</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup1;
