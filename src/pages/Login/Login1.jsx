import React, { useState } from "react";
import "./login1.css";
import { Link, useNavigate } from "react-router-dom";
import useLogin from "../../hooks/useLogin";
import { useOrderContext } from "../../context/OrderContext";
import ForgotPasswordModal from "./ForgotPasswordModal";
import { useWarehouseContext } from '../../context/WarehouseContext';
import imgg from "../../utils/new.png";
import { MdCheckCircle } from "react-icons/md";
import ShippingSteps from "./loginAnimation/ShippingSteps";

const Login1 = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldFilled, setFieldFilled] = useState({
    email: false,
    password: false,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { loading, login } = useLogin();
  const { fetchOrders } = useOrderContext();
  const {fetchWarehouse} = useWarehouseContext();

  const handleInputChange = (field, value) => {
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);

    // Update fieldFilled state
    setFieldFilled((prev) => ({ ...prev, [field]: value.trim() !== "" }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     //console.log(email);
  //     //console.log(password);
  //     await login(email, password);
  //     //console.log("ok");
  //     fetchOrders();
  //     navigate("/");
  //   } catch (error) {
  //     console.error("Login failed", error);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = await login(email, password);
    //console.log("User data received:", userData);
    if (userData?.role === "employee") {
      // Redirect to employee dashboard if role is 'employee'
      fetchOrders();
      fetchWarehouse();
      navigate("/employeedashboard");
    } else {
      // Default redirection for other users
      fetchWarehouse();
      fetchOrders();
      navigate("/");
    }
  };
  return (
    <>
      <div className="section">
        <div className="imgBx">
          <ShippingSteps />
          {/* <img src={imgg} alt="Background" /> */}
        </div>
        <div className="contentBx">
          <div className="formBx">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="inputBx">
                <label htmlFor="email">Email</label>
                <div className="inputContainer" style={{ display: "flex" }}>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
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

              <div className="inputBx">
                <label htmlFor="password">Password</label>
                <div className="inputContainer" style={{ display: "flex" }}>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
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
