import React from 'react';
import { Table } from 'antd';

const ActionTakenTab = ({ rowSelection, selectedRowKeys, dataSource }) => {
  // Define columns for the table
  const columns = [
    { title: 'Order Details', dataIndex: 'orderDetails' },
    { title: 'Customer Details', dataIndex: 'customerDetails' },
    { title: 'Product Details', dataIndex: 'ProductDetail' },
    { title: 'Package Details', dataIndex: 'PackageDetail' },
  ];

  return (
    <>
      {/* Display selected items count */}
      <span>
        {selectedRowKeys?.length > 0 ? `Selected ${selectedRowKeys?.length} items` : ''}
      </span>

      {/* Table displaying action taken details */}
      <Table 
        rowSelection={rowSelection} 
        columns={columns} 
        dataSource={dataSource}  
        scroll={{ y: 350 }} 
      />
    </>
  );
};

export default ActionTakenTab;
