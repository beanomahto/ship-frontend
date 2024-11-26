import React, { useState, useEffect } from "react";
import { Button, Table, DatePicker } from "antd";
import { Helmet } from "react-helmet";
import axios from "axios";
import { usePaymentUserContext } from "../../../context/PaymentUserContext";
import moment from "moment";
import { Link } from "react-router-dom";

const Wallet = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  //console.log(transactions);

  const newOrders = [
    // {
    //   title: "Datee & Time",
    //   dataIndex: "d&t",
    //   render: (text, transaction) => (
    //     <>
    //       <div>
    //         {moment(transaction?.updatedAt).format("DD-MM-YYYY")}
    //         <span style={{ marginLeft: "10px", fontStyle: "italic" }}>
    //           {moment(transaction?.updatedAt).format("HH:mm:ss")}
    //         </span>
    //       </div>
    //     </>
    //   ),
    // },
    {
      title: "Date & Time",
      dataIndex: "d&t",

      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        const [rangePickerValue, setRangePickerValue] = React.useState(null);

        return (
          <div style={{ padding: 8 }}>
            <DatePicker.RangePicker
              value={rangePickerValue}
              style={{ marginBottom: 8, display: "block" }}
              onChange={(dates) => {
                if (dates) {
                  const startDate = dates[0].startOf("day").toISOString();
                  const endDate = dates[1].endOf("day").toISOString();
                  setSelectedKeys([[startDate, endDate]]);
                  setRangePickerValue(dates);
                } else {
                  setSelectedKeys([]);
                  setRangePickerValue(null);
                }
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                type="primary"
                onClick={() => confirm()}
                size="small"
                style={{ width: 90 }}
              >
                Filter
              </Button>
              <Button
                onClick={() => {
                  clearFilters();
                  setRangePickerValue(null);
                }}
                size="small"
                style={{ width: 90 }}
              >
                Reset
              </Button>
            </div>
          </div>
        );
      },
      onFilter: (value, record) => {
        const [startDate, endDate] = value;
        const recordDate = moment(record.updatedAt).toISOString();
        return recordDate >= startDate && recordDate <= endDate;
      },
      render: (text, transaction) => (
        <>
          <div>
            {moment(transaction?.updatedAt).format("DD-MM-YYYY")}
            <span style={{ marginLeft: "10px", fontStyle: "italic" }}>
              {moment(transaction?.updatedAt).format("HH:mm:ss")}
            </span>
          </div>
        </>
      ),
    },
    {
      title: "Transaction ID",
      dataIndex: "trns_id",
    },
    {
      title: "Order Id",
      dataIndex: "ordr_id",
      render: (text, transaction) => (
        <>
          <div>{transaction?.order?.orderId}</div>
        </>
      ),
    },
    {
      title: "Tracking Id",
      dataIndex: "trcking_id",
      render: (text, transaction) => (
        <>
          <div>{transaction?.order?.awb}</div>
        </>
      ),
    },
    {
      title: "Debit",
      dataIndex: "debit",
    },
    {
      title: "Credit",
      dataIndex: "credit",
    },
    {
      title: "Remarks",
      dataIndex: "remark",
    },
  ];

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://backend.shiphere.in/api/transactions/getTransactions",
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        setTransactions(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);
  //console.log(transactions);

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="keyword" content={""} />
        <title>Wallet</title>
      </Helmet>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "1rem",
          marginBottom: "1rem",
        }}
        className="addorder"
      >
        <Button style={{ borderRadius: "14px", fontSize: "1rem" }}>
          <Link to="/finance/history">Recharge History</Link>
        </Button>
      </div>
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

export default Wallet;
