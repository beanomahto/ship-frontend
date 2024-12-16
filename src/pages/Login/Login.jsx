import React, { useState } from "react";
import "./login.css";
import email_icon from "./email.png";
import password_icon from "./password.png";
import { Link, useNavigate } from "react-router-dom";
import useLogin from "../../hooks/useLogin";
import ForgotPasswordModal from "./ForgotPasswordModal";
import { Helmet } from "react-helmet";
import { useOrderContext } from "../../context/OrderContext";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { loading, login } = useLogin();
  const { fetchOrders } = useOrderContext();

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     await login(email, password);
  //     fetchOrders();
  //     navigate("/");
  //   };
  const handleSubmit = async (e) => {
    // const isHashed = false;
    e.preventDefault();
    const userData = await login(email, password);
    //console.log("User data received:", userData);
    if (userData?.role === "employee") {
      // Redirect to employee dashboard if role is 'employee'
      //   fetchOrders();
      navigate("/employeedashboard");
    } else {
      // Default redirection for other users
      fetchOrders();
      navigate("/");
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mainConti">
          <div className="container">
            <div className="header">
              <div className="text">Login</div>
              <div className="underline"></div>
            </div>
            <div className="inputs">
              <div className="input">
                <img src={email_icon} alt="" />
                <input
                  type="email"
                  placeholder="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input">
                <img src={password_icon} alt="" />
                <input
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="forgot-password">
              Don't have an account?{" "}
              <Link to="/signup">
                <span>Click here!</span>
              </Link>
            </div>
            <div className="forgot-password">
              Forgot Password?{" "}
              <span onClick={() => setIsModalVisible(true)}>Click here!</span>
            </div>

            <div className="submit-container">
              <button className="submit">Login</button>
            </div>
          </div>
        </div>
      </form>
      <ForgotPasswordModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </>
  );
};

export default Login;
