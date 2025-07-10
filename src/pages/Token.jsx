import { Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useOrderContext } from "../context/OrderContext";
import { useWarehouseContext } from "../context/WarehouseContext";
import { useAuthContext } from "../context/AuthContext";
import { useEffect } from "react";

const Token = () => {
  const navigate = useNavigate();

  const { apiToken, setApiToken } = useAuthContext();

  const { fetchOrders } = useOrderContext();
  const { fetchWarehouse } = useWarehouseContext();

  useEffect(() => {
    if (!apiToken) {
      message.error("No token found. Redirecting...");
      navigate("/signup");
    }
  }, [apiToken, navigate]);

  if (!apiToken) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(apiToken);
    message.success("Token copied!");
  };

  const handleContinue = () => {
    fetchOrders();
    fetchWarehouse();
    navigate("/");
    setApiToken(null);
  };

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "600px",
        margin: "auto",
        textAlign: "center",
        background: "#fff",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        borderRadius: "12px",
        marginTop: "5rem",
      }}
    >
      <h2>Your API Token</h2>
      <p
        style={{
          wordWrap: "break-word",
          fontFamily: "monospace",
          fontSize: "1.1rem",
          padding: "1rem",
          backgroundColor: "#f5f5f5",
          border: "1px dashed #ccc",
          borderRadius: "8px",
          marginBottom: "1rem",
        }}
      >
        {apiToken}
      </p>
      <p style={{ color: "#888", marginBottom: "2rem" }}>
        {`Please copy and save this token safely. You won't be able to view it
        again.`}
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        <Button onClick={handleCopy}>Copy Token</Button>
        <Button type='primary' onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default Token;
