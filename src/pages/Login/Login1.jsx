import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { MdCheckCircle } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useOrderContext } from "../../context/OrderContext";
import { useWarehouseContext } from "../../context/WarehouseContext";
import useLogin from "../../hooks/useLogin";
import ForgotPasswordModal from "./ForgotPasswordModal";
import "./login1.css";
import ShippingSteps from "./loginAnimation/ShippingSteps";

const Login1 = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "", policy: "" });
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { loading, login } = useLogin();
  const { fetchOrders } = useOrderContext();
  const { fetchWarehouse } = useWarehouseContext();
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldFilled, setFieldFilled] = useState({
    email: false,
    password: false,
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleInputChange = (field, value) => {
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);
    setErrors((prev) => ({ ...prev, [field]: "" })); // Clear error on input change
    setFieldFilled((prev) => ({ ...prev, [field]: value.trim() !== "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert("This login page")
    let newErrors = { email: "", password: "", policy: "" };

    if (!email.trim()) newErrors.email = "Email is a required field.";
    if (!password.trim()) newErrors.password = "Password is a required field.";
    if (!policyAccepted) newErrors.policy = "You must accept the policies.";

    setErrors(newErrors);

    if (newErrors.email || newErrors.password || newErrors.policy) return;

    const userData = await login(email, password);

    if (!userData) {
      navigate("/login");
    } else if (userData?.role === "employee") {
      fetchOrders();
      fetchWarehouse();
      navigate("/employeedashboard");
    } else {
      fetchWarehouse();
      fetchOrders();
      navigate("/");
    }
  };

  return (
    <>
      {loading && <div className="loading-overlay"></div>}

      <div className="section">
        <div className="imgBx">
          <ShippingSteps />
        </div>
        <div className="contentBx">
          <div className="formBx">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="inputBx">
                <label htmlFor="email">
                  Email
                  <span style={{ color: "red", fontWeight: "500" }}>*</span>
                </label>
                <div className="inputContainer">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                  <span>
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
                  </span>
                </div>

                {errors.email && (
                  <p
                    className="error-message"
                    style={{ color: "red", fontSize: "12px" }}
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="inputBx">
                <label htmlFor="password">
                  Password
                  <span style={{ color: "red", fontWeight: "500" }}>*</span>
                </label>
                <div className="inputContainer">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                  />
                  <span
                    onClick={togglePasswordVisibility}
                    className="toggle-password"
                  >
                    {showPassword ? (
                      <AiFillEyeInvisible size={22} />
                    ) : (
                      <AiFillEye size={22} />
                    )}
                  </span>
                  <span>
                    {fieldFilled.password && (
                      <MdCheckCircle
                        size={27}
                        style={{
                          color: "green",
                          marginLeft: "4px",
                          marginTop: "5px",
                        }}
                      />
                    )}
                  </span>
                </div>
                {errors.password && (
                  <p
                    className="error-message"
                    style={{ color: "red", fontSize: "12px" }}
                  >
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Checkbox for Cancellation and Refund Policy */}
              <div
                className="inputBx policy-checkbox"
                style={{ marginTop: "15px", display: "flex" }}
              >
                <label style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    id="policyCheckbox"
                    checked={policyAccepted}
                    onChange={(e) => setPolicyAccepted(e.target.checked)}
                    style={{ marginRight: "8px", width: "50px" }}
                  />
                  <p>
                    I have read and agree to the
                    <a
                      href="/cancellation-refund-policy"
                      target="_blank"
                      style={{ fontSize: "13px", marginLeft: "5px" }}
                    >
                      Cancellation and Refund Policy
                    </a>
                    ,
                    <a
                      href="/privacy-policy"
                      target="_blank"
                      style={{ fontSize: "13px", marginLeft: "5px" }}
                    >
                      Privacy Policy
                    </a>
                    ,
                    <a
                      href="/Shipping-policy"
                      target="_blank"
                      style={{ fontSize: "13px", marginLeft: "5px" }}
                    >
                      Shipping Policy
                    </a>
                    ,
                    <a
                      href="/term-policy"
                      target="_blank"
                      style={{ fontSize: "13px", marginLeft: "5px" }}
                    >
                      Term and Conditions
                    </a>
                    ,
                    <a
                      href="/about-policy"
                      target="_blank"
                      style={{ fontSize: "13px", marginLeft: "5px" }}
                    >
                      about us
                    </a>{" "}
                    of Transportix Solutions Technology Pvt Ltd.
                  </p>
                </label>
                <span>
                  {!policyAccepted && (
                    <p
                      className="error-message"
                      style={{ color: "red", fontSize: "12px", marginTop: "-5px", marginLeft: "5px" }}
                    >
                      {errors.policy}
                    </p>
                  )}
                </span>
              </div>

              <div className="inputBx">
                <input type="submit" value="Login" disabled={loading} />
              </div>

              <div className="inputBx">
                <p>
                  Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
              </div>

              <div className="inputBx">
                Forgot Password?{" "}
                <span
                  onClick={() => setIsModalVisible(true)}
                  style={{ cursor: "pointer" }}
                >
                  Click here!
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>

      <ForgotPasswordModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </>
  );
};

export default Login1;
