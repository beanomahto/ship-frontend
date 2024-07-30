import { Table, Button } from 'antd';
import moment from 'moment';
import React from 'react';

const OpenWeightDispensory = ({ dataSource }) => {
  const columns = [
    {
      title: 'Weight Applied Date',
      dataIndex: 'weightAppliedDate',
      render: (text, data) => moment(data?.createdAt).format('DD-MM-YYYY'),
    },
    {
      title: 'Entered Weight',
      dataIndex: 'enteredWeight',
    },
    {
      title: 'Entered Dimension',
      dataIndex: 'enteredDimension',
    },
    {
      title: 'Order Id',
      dataIndex: 'orderId',
    },
    {
      title: 'AWB Number',
      dataIndex: 'awbNumber',
      key: 'chargedWeight',
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
    },
    {
      title: 'Applied Weight',
      dataIndex: 'appliedWeight',
    },
    {
      title: 'Weight Charges',
      dataIndex: 'weightCharges',
    },
    {
      title: 'Settled Charges',
      dataIndex: 'settledCharges',
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
    },
  ];
  const openData = dataSource?.filter(data => data.status === 'Open')
  return (
    <Table
      className='table'
      scroll={{ y: 350 }}
      dataSource={openData}
      columns={columns}
      rowKey="id"
    />
  );
};

export default OpenWeightDispensory;
