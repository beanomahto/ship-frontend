import React, { useState,useEffect, useMemo } from "react";
import { Button, Table, Input, DatePicker } from "antd";
import PaymentModel from "./Payment/PaymentModel";
import { usePaymentUserContext } from "../../../context/PaymentUserContext";
import moment from "moment";
import { Helmet } from "react-helmet";
import { CSVLink } from "react-csv";
import "./wallet.css";

const { Search } = Input;

const AdminWallet = () => {
  const { pUsers, loading } = usePaymentUserContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");


  const showModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);


  // Function to check if any field contains the search text
  const matchesSearchText = (record, searchText) => {
    const lowercasedText = searchText.toLowerCase();
    return (
      moment(record.updatedAt).format("DD-MM-YYYY").includes(lowercasedText) ||
      record.user?.companyName?.toLowerCase().includes(lowercasedText) ||
      "N/A".includes(lowercasedText) ||
      record.credit?.toString().toLowerCase().includes(lowercasedText) ||
      record.amount?.toString().toLowerCase().includes(lowercasedText) ||
      record.remark?.toLowerCase().includes(lowercasedText)
    );
  };
 
  // Filtered data based on the search text across all fields
  const filteredUsers = useMemo(() => {
    return pUsers.filter((user) => matchesSearchText(user, searchText));
  }, [pUsers, searchText]);
console.log("nokk", filteredUsers);

  // Function to convert data to CSV format
  const generateCsvData = () => {
    return filteredUsers.map((user) => ({
      "Date & Time": moment(user.updatedAt).format("DD-MM-YYYY"),
      "Company Info": user.user?.companyName || "N/A",
      Payment: user.credit,
      Transaction_Id:user.phonepeTransactionId,
      Updated_Total: user.amount,
      Payment_Method: user.phonepeInstrument,
      Remark: user.remark,
    }));
  };

  const newOrders = [
   
    {
      title: "Date & Time",
      dataIndex: "updatedAt",
      align: "center",
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
        const orderDate = moment(record.updatedAt).toISOString();
        return orderDate >= startDate && orderDate <= endDate;
      },
      render: (text, pUsers) => (
        <div style={{ display: "flex" }}>
          {moment(pUsers?.updatedAt).format("DD-MM-YYYY")}
          <span style={{ marginLeft: "10px", fontStyle: "italic" }}>
            {moment(pUsers?.updatedAt).format("HH:mm")}
          </span>
        </div>
      ),
    
    },
    {
      title: "Company Info",
      dataIndex: "user",
      align: "center",
      render: (user) => user?.companyName || "N/A",
    },
    {
      title: "Transaction_Id",
      dataIndex: "_id",
      align: "center",
      render: (text, filteredUsers) => (
        <>
          <div>{filteredUsers.phonepeTransactionId}</div>
        </>
      ),
    },
    {
      title: "Payment",
      dataIndex: "credit",
      align: "center",
    },
    {
      title: "Updated Amount",
      dataIndex: "amount",
      align: "center",
      render: (text, filteredUsers) => (
        <>
          <div>{filteredUsers.amount?.toFixed(2)}</div>
        </>
      ),
    },
    {
      title: "Transaction Status",
      dataIndex: "status",
      align: "center",
      render: (text, filteredUsers) => (
        <>
          <div>{text}</div>
          <div
            style={{
              color: filteredUsers.phonepeTransactionId ? "green" : "red",
              fontStyle: "italic",
            }}
          >
            {filteredUsers.phonepeTransactionId ? "Success" : "Failure"}
          </div>
        </>
      ),
  
    },    
    {
      title: "Payment_Method",
      dataIndex: "method",
      align: "center",
      render: (text, filteredUsers) => (
        <>
          <div>{filteredUsers.phonepeInstrument}</div>
        </>
      ),
    },
    {
      title: "Remark",
      dataIndex: "remark",
      align: "center",
    },
   
  ];

  const handleClearSearch = () => {
    setSearchText("");
  };

  return (
    <div className="admin-wallet">
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="keyword" content={""} />
        <title>Admin Wallet</title>
      </Helmet>
      <div className="admin-wallet__header">
        <div className="admin-wallet__search">
          <Search
            placeholder="Search across all fields"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="admin-wallet__search-input"
          />
          <Button
            onClick={handleClearSearch}
            className="admin-wallet__clear-button"
          >
            Clear
          </Button>
        </div>
        <div className="admin-wallet__actions">
          <Button
            type="primary"
            onClick={showModal}
            className="admin-wallet__payment-button"
          >
            Payment
          </Button>
          <PaymentModel visible={modalVisible} onClose={closeModal} />
          {filteredUsers.length > 0 && (
            <CSVLink
              data={generateCsvData()}
              filename={"filtered_users.csv"}
              className="ant-btn ant-btn-primary"
            >
              <Button type="default" className="admin-wallet__download-button">
                Download CSV
              </Button>
            </CSVLink>
          )}
        </div>
      </div>
      <Table
        className="table"
        scroll={{ x: 1000, y: 500 }}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100", "500", "1000"],
          defaultPageSize: 10,
        }}
        dataSource={filteredUsers}
        columns={newOrders}
      />
    </div>
  );
};

export default AdminWallet;
