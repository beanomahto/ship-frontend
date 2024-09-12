import React, { useState, useEffect } from 'react';
import { Button, Modal, Select, message } from 'antd';
import { useWarehouseContext } from '../../../context/WarehouseContext';
import { useDeliveryPartner } from '../../../context/DeliveryPartners';
import useShipNowCost from '../../../hooks/useShipNowCost';

const ShipNowModel = ({ visible, onClose, onShipNow, selectedRowKeys, hasSelected, selectedOrderData }) => {
  const { deliveryPartners } = useDeliveryPartner();
  const { warehouse } = useWarehouseContext();
  const { shipNowCost } = useShipNowCost(); 

  const defaultWarehouse = warehouse?.warehouses?.[0];
  
  const [selectedWarehouse, setSelectedWarehouse] = useState(defaultWarehouse || null);
  const [selectedDeliveryPartner, setSelectedDeliveryPartner] = useState(null);

  useEffect(() => {
    if (defaultWarehouse) {
      setSelectedWarehouse(defaultWarehouse);
    }
  }, [defaultWarehouse]);

  const handleWarehouseChange = (value) => {
    const selectedWarehouseData = warehouse?.warehouses?.find((w) => w._id === value);
    setSelectedWarehouse(selectedWarehouseData);
  };

  const handleDeliveryPartnerChange = (value) => {
    const selectedPartner = deliveryPartners?.deliveryPartners?.find((d) => d._id === value);
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
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="ship"
          type="primary"
          onClick={handleShipNow}
          disabled={!selectedWarehouse || !selectedDeliveryPartner || selectedRowKeys.length === 0}
        >
          Ship Now
        </Button>,
      ]}
    >
      <div>
        <label>
          <span>Select Warehouse</span>
          <Select
            value={selectedWarehouse?._id}  
            className="input shipModel"
            onChange={handleWarehouseChange}
          >
            {warehouse?.warehouses?.map((w) => (
              <Select.Option key={w._id} value={w._id}>
                {w.warehouseName}
              </Select.Option>
            ))}
          </Select>
          <span>Select Courier Partner</span>
          <Select
            value={selectedDeliveryPartner?._id}  
            className="input shipModel crr"
            onChange={handleDeliveryPartnerChange}
          >
            {deliveryPartners?.deliveryPartners?.map((d) => (
              <Select.Option key={d._id} value={d._id}>
                {d.name}
              </Select.Option>
            ))}
          </Select>
        </label>
        <span style={{ marginLeft: 8 }}>
          {hasSelected ? `You Selected ${selectedRowKeys.length} items` : ''}
        </span>
      </div>
    </Modal>
  );
};

export default ShipNowModel;
