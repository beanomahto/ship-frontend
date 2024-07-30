import React, { useState, useEffect } from 'react';
import { Button, Modal, Select } from 'antd';
import { useWarehouseContext } from '../../../context/WarehouseContext';
import useShipNowCost from '../../../hooks/useShipNowCost';
import { useDeliveryPartner } from '../../../context/DeliveryPartners';

const ShipNowModel = ({ visible, onClose, onShipNow, selectedRowKeys, hasSelected }) => {
  const {deliveryPartners} = useDeliveryPartner();
  console.log(deliveryPartners);
  const { warehouse } = useWarehouseContext();
  console.log(warehouse);
  const [selectedWarehouse, setSelectedWarehouse] = useState( warehouse?.warehouses?.[0]?._id ||  null);
  const [deliveryPartner, setDeliveryPartner] = useState('');

  const handleWarehouseChange = (value) => {
    setSelectedWarehouse(value);
  };

  const handleDeliveryPartnerChange = (value) => {
    setDeliveryPartner(value);
  };

  const handleShipNow = () => {
    onShipNow(selectedRowKeys);
  };
  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="ship" type="primary" onClick={handleShipNow} disabled={!selectedWarehouse || selectedRowKeys.length === 0}>
          Ship Now:
        </Button>,
      ]}
    >
      <div>
        <label>
          <span>Select Warehouse</span>
          <Select defaultValue={selectedWarehouse} className='input shipModel' onChange={handleWarehouseChange}>
            {warehouse?.warehouses?.map((w) => (
              <Select.Option key={w._id} value={w._id}>{w.address}</Select.Option>
            ))}
          </Select>
          <span>Select Courier Partner</span>
          <Select className='input shipModel crr' onChange={handleDeliveryPartnerChange}>
          {deliveryPartners?.deliveryPartners?.map((d) => (
              <Select.Option >{d.name}</Select.Option>
            ))}
          </Select>
        </label>
        {/* {loading ? (
          <p>Loading...</p>
        ) : (
          deliveryCost !== null && <h1>Delivery Cost: {deliveryCost}</h1>
        )} */}
        <span style={{ marginLeft: 8 }}>{hasSelected ? `You Selected ${selectedRowKeys.length} items` : ''}</span>
      </div>
    </Modal>
  );
};

export default ShipNowModel;
