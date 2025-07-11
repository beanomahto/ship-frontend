import React, { useState } from "react";
// import './login.css';
import { useNavigate, useSearchParams } from "react-router-dom";
import imgg from "../../utils/new.png";
const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log("clicked");
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          email,
          newPassword,
          confirmPassword,
        }),
      });
      //console.log(email);
      //console.log(newPassword);
      //console.log(confirmPassword);
      //console.log(response);
      const data = await response.json();
      //console.log(data);
      if (response.ok) {
        alert("Password reset successfully");
        navigate("/login");
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred");
    }
  };

  return (
    <>
      <div className="section">
        <div className="imgBx">
          <img src={imgg} alt="Background" />
        </div>
        <div className="contentBx">
          <div className="formBx">
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
              <div className="inputBx">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="inputBx">
                <label htmlFor="password">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="inputBx">
                <label htmlFor="password">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="inputBx">
                <input type="submit" value="Login" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
