import React, { useState } from 'react'
import { Button, Table } from 'antd';
import PaymentModel from './Payment/PaymentModel';
import { usePaymentUserContext } from '../../../context/PaymentUserContext';
import moment from 'moment';
import { Helmet } from 'react-helmet';

const AdminWallet = () => {

  const { pUsers } = usePaymentUserContext();
  console.log(pUsers);
  
  const newOrders = [
        {
          title: 'Date & Time',
          dataIndex: 'updatedAt',
          render: (text, pUsers) => moment(pUsers?.updatedAt).format('DD-MM-YYYY'),
        },
        // {
        //   title: 'Company ID',
        //   dataIndex: 'user',
        //   render: (user) => user?.companyId || 'N/A',
        // },
        {
          title: 'Company Info',
          dataIndex: 'user',
          render: (user) => user?.companyName || 'N/A',
        },
        {
          title: 'Payment',
          dataIndex: 'credit',
        },
        {
          title: 'Total',
          dataIndex: 'amount',
        },
        {
          title: 'Remark',
          dataIndex: 'remark',
        }
      ];
      const [modalVisible, setModalVisible] = useState(false);
      const showModal = () => setModalVisible(true);
      // const rowSelection = {
      //   selectedRowKeys,
      //   onChange: onSelectChange,
      //   // onSelect: showModalShipNow,
      // };
    
      const closeModal = () => setModalVisible(false);
  return (
    <div>
         <Helmet>
                <meta charSet='utf-8' />
                <meta name='keyword' content={""} />
                <title>Admin Wallet</title>
            </Helmet>
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap:'1rem',
            marginBottom:'1rem'
          }} className="addorder" >
           <Button onClick={showModal}>Payment</Button>
          <PaymentModel visible={modalVisible} onClose={closeModal}/>
      </div>
        <Table className='table'  scroll={{ y: 350, }} dataSource={pUsers} columns={newOrders} />
    </div>
  )
}

export default AdminWallet
