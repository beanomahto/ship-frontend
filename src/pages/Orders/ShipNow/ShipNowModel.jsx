import React, { useState, useEffect } from "react";
import { Button, Modal, Select, message, Typography } from "antd";
import { HomeOutlined, CarOutlined } from "@ant-design/icons";
import { useWarehouseContext } from "../../../context/WarehouseContext";
import { useDeliveryPartner } from "../../../context/DeliveryPartners";
import useShipNowCost from "../../../hooks/useShipNowCost";
// import "./shipmodel.css";

const { Title, Text } = Typography;
const ShipNowModel = ({
  visible,
  onClose,
  onShipNow,
  selectedRowKeys,
  hasSelected,
  selectedOrderData,
}) => {
  const { deliveryPartners } = useDeliveryPartner();
  const { warehouse } = useWarehouseContext();
  //console.log("warehouse", warehouse);
  const { shipNowCost } = useShipNowCost();

  const defaultWarehouse = warehouse?.warehouses?.[0];

  const [selectedWarehouse, setSelectedWarehouse] = useState(
    defaultWarehouse || null
  );
  const [selectedDeliveryPartner, setSelectedDeliveryPartner] = useState(null);

  useEffect(() => {
    if (defaultWarehouse) {
      setSelectedWarehouse(defaultWarehouse);
    }
  }, [defaultWarehouse]);

  const handleWarehouseChange = (value) => {
    const selectedWarehouseData = warehouse?.warehouses?.find(
      (w) => w._id === value
    );
    setSelectedWarehouse(selectedWarehouseData);
  };

  const handleDeliveryPartnerChange = (value) => {
    const selectedPartner = deliveryPartners?.deliveryPartners?.find(
      (d) => d._id === value
    );
    setSelectedDeliveryPartner(selectedPartner);
  };

  const handleShipNow = () => {
    if (selectedDeliveryPartner && selectedWarehouse) {
      onShipNow(selectedRowKeys, selectedWarehouse, selectedDeliveryPartner);
    } else {
      message.error("Please select both a warehouse and a delivery partner.");
    }
  };

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={[
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Button
            key="cancel"
            onClick={onClose}
            style={{
              fontSize: "16px",
              padding: "20px",
            }}
          >
            Cancel
          </Button>

          <Button
            key="ship"
            type="primary"
            onClick={handleShipNow}
            disabled={
              !selectedWarehouse ||
              !selectedDeliveryPartner ||
              selectedRowKeys.length === 0
            }
            style={{
              fontSize: "16px",
              padding: "20px",
            }}
          >
            Ship Now
          </Button>
        </div>,
      ]}
    >
      <div>
        <label>
          <span style={{ fontSize: "17px", color: "#1758b3" }}>
            Select Warehouse
          </span>
          <Select
            value={selectedWarehouse?._id}
            className="input shipModel"
            onChange={handleWarehouseChange}
            style={{
              marginLeft: "2px",
              marginTop: "18px",
              borderRadius: "8px",
              padding: "1px",
              boxShadow: "inset 0 1px 04px rgba(0, 0, 0, 0.1)",
            }}
          >
            {warehouse?.warehouses?.map((w) => (
              <Select.Option key={w._id} value={w._id}>
                {w.warehouseName}
              </Select.Option>
            ))}
          </Select>
          <span style={{ fontSize: "17px", color: "#1758b3" }}>
            Select Courier Partner
          </span>
          <Select
            value={selectedDeliveryPartner?._id}
            className="input shipModel crr"
            onChange={handleDeliveryPartnerChange}
            style={{
              marginLeft: "2px",
              marginTop: "18px",
              marginBottom: "50px",
              borderRadius: "8px",
              padding: "1px",
              boxShadow: "inset 0 1px 04px rgba(0, 0, 0, 0.1)",
            }}
          >
            {deliveryPartners?.deliveryPartners?.map((d) => (
              <Select.Option key={d._id} value={d._id}>
                {d.name}
              </Select.Option>
            ))}
          </Select>
        </label>
        <span style={{ marginLeft: 8, color: "gray" }}>
          {hasSelected ? `You Selected ${selectedRowKeys.length} items` : ""}
        </span>
      </div>
    </Modal>
  );
};

export default ShipNowModel;
