import React, { useState } from "react";
import {
  Button,
  DatePicker,
  Input,
  message,
  Popover,
  Space,
  Table,
  Tag,
} from "antd";
import {
  MenuFoldOutlined,
  SearchOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { useAuthContext } from "../../../context/AuthContext";
import { Link } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import { CalendarOutlined } from "@ant-design/icons";
const ActionTakenTab = ({ rowSelection, selectedRowKeys, dataSource }) => {
  const { authUser } = useAuthContext();
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : "black" }} />
    ),
    onFilter: (value, record) => {
      const keys = dataIndex.split(".");
      let data = record;
      keys.forEach((key) => {
        data = data ? data[key] : null;
      });
      return data
        ? data.toString().toLowerCase().includes(value.toLowerCase())
        : "";
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <span style={{ backgroundColor: "#ffc069", padding: 0 }}>{text}</span>
      ) : (
        text
      ),
  });
  const columns = [
    {
      title: "Order Id",
      dataIndex: "orderId",
      ...getColumnSearchProps("orderId"),
      render: (text, order) => (
        <Link
          style={{
            color: "black",
            fontWeight: "400",
            fontFamily: "Poppins",
            textAlign: "center",
          }}
          to={`/orders/In/updateorder/${order?._id}/${order?.orderId}`}
        >
          {order.orderId}
        </Link>
      ),
      className: "centered-row",
    },
    {
      title: "Order Status",
      dataIndex: "o_status",
      ...getColumnSearchProps("awb"),
      render: (text, order) => (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span>
            {order.shippingPartner && order.awb && (
              <a
                target="_blank"
                href={`/tracking/shipment/${order.shippingPartner}/${order.awb}`}
              >
                <Button type="link">{order.awb ? order.awb : "no"}</Button>
              </a>
            )}
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Tag
              style={{
                display: "flex",
                justifyContent: "center",
                maxWidth: "max-content",
              }}
              color={order.status === "Delivered" ? "green" : "volcano"}
            >
              {order.status}
            </Tag>
          </div>
        </div>
      ),
      className: "centered-row",
    },
    {
      title: "Customer Info",
      dataIndex: "customerName",
      ...getColumnSearchProps("customerName"),
      render: (text, order) => (
        <div
          style={{
            fontFamily: "Poppins",
            fontSize: ".9rem",
            fontWeight: "500",
            textAlign: "center",
          }}
        >
          <div>{order.customerName}</div>
          <div>{order.customerPhone}</div>
        </div>
      ),
      className: "centered-row",
    },
    {
      title: "Payment Details",
      dataIndex: "paymentMethod",
      filters: [
        { text: "COD", value: "COD" },
        { text: "Prepaid", value: "prepaid" },
      ],
      onFilter: (value, record) => record.paymentMethod === value,
      render: (text, order) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              maxWidth: "4.5rem",
              justifyContent: "center",
              fontFamily: "Poppins",
              fontSize: ".9rem",
              fontWeight: "500",
            }}
          >
            <div>&#8377; {order.productPrice}</div>
            <Tag
              color={
                order.paymentMethod === "COD"
                  ? "green-inverse"
                  : "geekblue-inverse"
              }
            >
              {order.paymentMethod}
            </Tag>
          </div>
        </div>
      ),
      className: "centered-row",
    },
    {
      title: "Order Date",
      dataIndex: "updatedAt",
      ...getColumnSearchProps("updatedAt"),

      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        const [rangePickerValue, setRangePickerValue] = React.useState(null);

        return (
          <div style={{ padding: 8 }}>
            {/* DateRange Picker for filtering */}
            <DatePicker.RangePicker
              value={rangePickerValue}
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
              style={{ marginBottom: 8, display: "block" }}
            />
            <Space>
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
                  setRangePickerValue(null); // Reset the RangePicker value
                }}
                size="small"
                style={{ width: 90 }}
              >
                Reset
              </Button>
            </Space>
          </div>
        );
      },
      filterIcon: (filtered) => (
        <CalendarOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) => {
        const [startDate, endDate] = value;
        const orderDate = moment(record.updatedAt).toISOString();
        return orderDate >= startDate && orderDate <= endDate;
      },
      render: (text, order) => (
        <>
          <div>
            {moment(order?.updatedAt).format("DD-MM-YYYY")}
            <span style={{ marginLeft: "10px", fontStyle: "italic" }}>
              {moment(order?.updatedAt).format("HH:mm")}
            </span>
          </div>
        </>
      ),
      className: "centered-row",
    },
    ...(authUser?.role === "admin"
      ? [
          {
            title: "Seller Email",
            dataIndex: "seller.email",
            ...getColumnSearchProps("seller.email"),
            render: (_, record) => (
              <span style={{ textAlign: "center" }}>
                {record?.seller?.email}
              </span>
            ),
            className: "centered-row",
          },
        ]
      : []),
  ];

  const takenOrders = dataSource?.filter(
    (order) =>
      (order?.ndrstatus === "RTO" || order?.ndrstatus === "RtoDone") &&
      order?.status !== "Delivered"
  );
  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          padding: "10px 20px",
        }}
      ></div>

      <span style={{ marginBottom: 16, display: "block" }}>
        {selectedRowKeys?.length > 0
          ? `Selected ${selectedRowKeys?.length} items`
          : ""}
      </span>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={takenOrders}
        scroll={{ x: 800 }}
        style={{ overflowX: "auto", marginTop: "-20px" }}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100", "500", "1000"],
          defaultPageSize: 10,
        }}
        className="centered-table"
      />
    </div>
  );
};

export default ActionTakenTab;
