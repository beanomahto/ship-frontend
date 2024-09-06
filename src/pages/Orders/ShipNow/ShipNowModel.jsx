import React, { useState } from 'react';
import { Button, Modal, Select, message } from 'antd';
import { useWarehouseContext } from '../../../context/WarehouseContext';
import { useDeliveryPartner } from '../../../context/DeliveryPartners';
import useShipNowCost from '../../../hooks/useShipNowCost';

const ShipNowModel = ({ visible, onClose, onShipNow, selectedRowKeys, hasSelected }) => {
  const { deliveryPartners } = useDeliveryPartner();
  const { warehouse } = useWarehouseContext();
  const { shipNowCost } = useShipNowCost(); 

  const [selectedWarehouse, setSelectedWarehouse] = useState(warehouse?.warehouses?.[0] || null);
  const [selectedDeliveryPartner, setSelectedDeliveryPartner] = useState(null);
  const [shippingCosts, setShippingCosts] = useState([]);

  const handleWarehouseChange = (value) => {
    setSelectedWarehouse(value);
  };

  const handleDeliveryPartnerChange = (value) => {
    const selectedPartner = deliveryPartners.deliveryPartners.find((d) => d._id === value);
    setSelectedDeliveryPartner(selectedPartner);

    // if (selectedWarehouse && selectedRowKeys.length > 0) {
    //   calculateShippingCost(selectedWarehouse, selectedRowKeys);
    // }
  };


console.log(selectedDeliveryPartner);

const handleShipNow = () => {
  console.log("ok");
  console.log(selectedDeliveryPartner);
  
  if (selectedDeliveryPartner) {
    console.log("ok1");
    console.log(shippingCosts);
    onShipNow(selectedRowKeys, selectedWarehouse,selectedDeliveryPartner);
  }
    
  //   const selectedCost = shippingCosts?.cost?.find(
  //     (cost) => cost.deliveryPartner === selectedDeliveryPartner.name
  //   )?.cost;
    
  //   if (selectedCost === undefined) {
  //     message.error('No cost found for the selected delivery partner.');
  //     return;
  //   }
  // } else {
  //     message.error('Please select a valid delivery partner and warehouse.');
  // }
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
            defaultValue={selectedWarehouse}
            className="input shipModel"
            onChange={handleWarehouseChange}
          >
            {warehouse?.warehouses?.map((w) => (
              <Select.Option key={w._id} value={w._id}>
                {w.address}
              </Select.Option>
            ))}
          </Select>
          <span>Select Courier Partner</span>
          <Select
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
