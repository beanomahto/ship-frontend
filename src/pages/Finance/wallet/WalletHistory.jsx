import React, { useState, useEffect } from "react";
import { Button, Table } from "antd";
import { Helmet } from "react-helmet";
import axios from "axios";
// import { usePaymentUserContext } from '../../../context/PaymentUserContext';
import moment from "moment";
import { Link } from "react-router-dom";

const WalletHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const newOrders = [
    {
      title: "Payment ID",
      dataIndex: "_id",
      align: "center",
    },
    {
      title: "Credit",
      dataIndex: "credit",
      align: "center",
    },
    {
      title: "Balance",
      dataIndex: "balance",
      align: "center",
      render: (text, transaction) => (
        <>
     <div>{transaction.amount?.toFixed(2)}</div>
          {/* <div style={{ color: "#888" }}>{transaction.phonepetransactionid}</div> */}
        </>
      ),
    },
    // {
    //   title: "Transaction Detail",
    //   dataIndex: "transaction_id",
    // },
    // {
    //   title: "Transaction Status",
    //   dataIndex: "status",
    // },
    {
      title: "Transaction Detail",
      dataIndex: "transaction_id",
      align: "center",
      render: (text, transaction) => (
        <>
          <div >{transaction.phonepeTransactionId}</div>
          
        </>
      ),
    },
    {
      title: "Transaction Status",
      dataIndex: "status",
      align: "center",
      render: (text, transaction) => (
        <>
          <div>{text}</div>
          <div
            style={{
              color: transaction.phonepeTransactionId ? "green" : "red",
              fontStyle: "italic",
            }}
          >
            {transaction.phonepeTransactionId ? "Success" : "Failure"}
          </div>
        </>
      ),
  
    },    
    {
      title: "Date & Time",
      dataIndex: "d&t",
      align: "center",
      render: (text, transaction) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          {moment(transaction?.updatedAt).format("DD-MM-YYYY")}
        </div>
      ),
    },
    
    {
      title: "Remark",
      dataIndex: "remark",
      align: "center",
    },
  ];

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://backend.shiphere.in/api/recharge/getUserRecharge",
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        console.log("res ppp", response);
        setTransactions(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  console.log(transactions);

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="keyword" content={""} />
        <title>Wallet History</title>
      </Helmet>
      <Table
        className="table"
        scroll={{ x: 1000, y: 500 }}
        columns={newOrders}
        dataSource={transactions}
        loading={loading}
        rowKey={(record) => record.trns_id}
      />
    </div>
  );
};

export default WalletHistory;
