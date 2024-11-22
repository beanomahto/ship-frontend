import React, { useEffect, useState } from 'react'
import { useOrderContext } from '../../../context/OrderContext';
import { Space, Table, Tag } from 'antd';

function LostDamage() {
    const { orders, setOrders, fetchOrders } = useOrderContext();

    useEffect(() => {
      fetchOrders(); 
    }, []);
  
    const columns = [
      {
        title: 'Claim ID',
        dataIndex: 'claimId',
        key: 'claimId',
      },
      {
        title: 'AWB Number',
        dataIndex: 'awb',
      },
      {
        title: 'Order ID',
        dataIndex: 'orderId',
        key: 'orderId',
      },
      {
        title: 'Claim Type',
        dataIndex: 'claimType',
      },
      {
        title: 'Reason',
        dataIndex: 'reason',
      },
      {
        title: 'Courier Partner',
        dataIndex: 'courier',
        key: 'courier',
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status) => {
          let color = status === 'Resolved' ? 'green' : status === 'Pending' ? 'orange' : 'red';
          return <Tag color={color}>{status.toUpperCase()}</Tag>;
        },
      },
      {
        title: 'Reported Date',
        dataIndex: 'updatedAt',
      },
      {
        title: 'Proof Submitted',
        dataIndex: 'proof',
        key: 'proof',
      },
      {
        title: 'Compensation',
        dataIndex: 'compensation',
        key: 'compensation',
      },
      {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
          <Space size="middle">
            <a href="#">View</a>
            {record.status === 'Pending' && <a href="#">Resolve</a>}
          </Space>
        ),
      },
    ];
  const lost_damage_Order = orders?.orders?.filter((status) => status.ndrstatus === 'Lost')
    return (
      <div style={{ padding: '20px' }}>
        <h2>Lost and Damage Claims</h2>
        <Table
            // rowSelection={rowSelection}
            columns={columns}
            dataSource={lost_damage_Order}
            className="centered-table"
            rowKey="_id"
            scroll={{ x:1050,y: 400 }}
            pagination={{
              showSizeChanger: true,
            }}
            style={{ width: '100%', height: '505px' }}
          />
      </div>
    );
}

export default LostDamage