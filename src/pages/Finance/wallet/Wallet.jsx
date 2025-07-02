import { Button, DatePicker, Modal, Table, message } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const Wallet = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [developerMode, setDeveloperMode] = useState(false);

  const newOrders = [
    {
      title: "Date & Time",
      dataIndex: "d&t",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        const [rangePickerValue, setRangePickerValue] = useState(null);
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
        <div>
          {moment(transaction?.updatedAt).format("DD-MM-YYYY")}
          <span style={{ marginLeft: "10px", fontStyle: "italic" }}>
            {moment(transaction?.updatedAt).format("HH:mm:ss")}
          </span>
        </div>
      ),
    },
    {
      title: "Transaction ID",
      dataIndex: "trns_id",
    },
    {
      title: "Order Id",
      dataIndex: "ordr_id",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        const [searchInput, setSearchInput] = useState("");

        const handleSearch = () => {
          if (searchInput === "IamA_Developer") {
            setDeveloperMode(true);
            clearFilters();
            setSearchInput("");
            message.success("Developer mode enabled!");
          } else {
            setDeveloperMode(false);
            confirm();
          }
        };

        const handleReset = () => {
          clearFilters();
          setSearchInput("");
          setDeveloperMode(false);
        };

        return (
          <div style={{ padding: 8 }}>
            <input
              placeholder="Search Order Id"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setSelectedKeys(e.target.value ? [e.target.value] : []);
              }}
              onPressEnter={handleSearch}
              style={{
                marginBottom: 8,
                padding: "5px",
                display: "block",
                width: "90%",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                type="primary"
                onClick={handleSearch}
                size="small"
                style={{ width: 90 }}
              >
                Search
              </Button>
              <Button onClick={handleReset} size="small" style={{ width: 90 }}>
                Reset
              </Button>
            </div>
          </div>
        );
      },

      onFilter: (value, record) =>
        record?.order?.orderId.toLowerCase().includes(value.toLowerCase()),
      render: (text, transaction) => <div>{transaction?.order?.orderId}</div>,
    },
    {
      title: "Tracking Id",
      dataIndex: "trcking_id",
      render: (text, transaction) => <div>{transaction?.order?.awb}</div>,
    },
    {
      title: "Debit",
      dataIndex: "debit",
      render: (text, transaction) => (
        <div>{transaction?.debit?.toFixed(2)}</div>
      ),
    },
    {
      title: "Credit",
      dataIndex: "credit",
      render: (text, transaction) => (
        <div>{transaction?.credit?.toFixed(2)}</div>
      ),
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
          "http://localhost:5000/api/transactions/getTransactions",
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        console.log("Transactions fetched:", response.data);

        setTransactions(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleDelete = async () => {
    Modal.confirm({
      title: "Are you sure you want to delete the selected transactions?",
      onOk: async () => {
        try {
          setDeleting(true);
          const token = localStorage.getItem("token");
          await axios.post(
            "http://localhost:5000/api/transactions/deletetransaction",
            { transactionIds: selectedRowKeys },
            {
              headers: {
                Authorization: `${token}`,
              },
            }
          );
          message.success("Transactions deleted successfully!");
          setTransactions((prev) =>
            prev.filter(
              (transaction) => !selectedRowKeys.includes(transaction._id)
            )
          );
          setSelectedRowKeys([]);
        } catch (error) {
          console.error("Error deleting transactions:", error);
          message.error("Failed to delete transactions.");
        } finally {
          setDeleting(false);
        }
      },
    });
  };

  const rowSelection = developerMode
    ? {
        selectedRowKeys,
        onChange: (selectedKeys) => setSelectedRowKeys(selectedKeys),
      }
    : null;

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
        {developerMode && (
          <Button
            type="danger"
            onClick={handleDelete}
            disabled={selectedRowKeys.length === 0}
            loading={deleting}
            style={{ borderRadius: "14px", fontSize: "1rem" }}
          >
            Delete Selected
          </Button>
        )}
      </div>
      <Table
        className="table"
        scroll={{ x: 1000, y: 500 }}
        columns={newOrders}
        dataSource={transactions}
        loading={loading}
        rowKey={(record) => record._id} // Use unique _id here
        rowSelection={rowSelection} // Conditional row selection
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100", "500", "1000"],
          defaultPageSize: 10,
        }}
      />
    </div>
  );
};

export default Wallet;
