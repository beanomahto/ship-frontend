import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  message,
  Tag,
  Skeleton,
  DatePicker,
  Modal,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import axios from "axios";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Shopify from "../../utils/shopify.png";
import Woo from "../../utils/woocomerce.png";
import logo from "../../utils/logo1.jpg";
import { useAuthContext } from "../../context/AuthContext";
import { DeleteOutlined } from "@ant-design/icons";

const { confirm } = Modal;

const AllOrderComponent = ({ dataSource, fetchOrders, loading, tab }) => {
  //console.log(tab);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
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
  const tabs = tab.tab.split(" ")[0];
  //console.log(tabs);
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://backend.shiphere.in/api/orders/deleteOrder/${id}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      message.success("Order deleted successfully");
      fetchOrders();
    } catch (error) {
      console.error("Error deleting Order:", error);
      message.error("Failed to delete Order");
    }
  };
  const showDeleteConfirm = (id) => {
    confirm({
      title: "Are you sure you want to delete this Order?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        handleDelete(id);
      },
      onCancel() {
        //console.log('Cancel deletion');
      },
    });
  };
  const handleBulkDelete = () => {
    confirm({
      title: "Are you sure you want to delete the selected orders?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        const promises = selectedRowKeys.map((id) => handleDelete(id));
        await Promise.all(promises);
        setSelectedRowKeys([]);
        fetchOrders();
        message.success("Selected orders deleted successfully");
      },
    });
  };

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
          to={`/orders/${tabs}/updateorder/${order?._id}/${order?.orderId}`}
        >
          {order.orderId}
        </Link>
      ),
    },

    {
      title: "Shipping Status",
      dataIndex: "awb",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search AWB or Partner"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()} // Trigger filtering on pressing Enter
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => {
                clearFilters();
                confirm(); // Reset and apply the cleared filter
              }}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) => {
        const lowerValue = value.toLowerCase();
        return (
          record.awb?.toLowerCase().includes(lowerValue) ||
          record.shippingPartner?.toLowerCase().includes(lowerValue)
        );
      },
      render: (value, record) => (
        <>
          {record.awb && record.shippingPartner && (
            <a
              target="_blank"
              href={`/tracking/shipment/${record.shippingPartner}/${record.awb}`}
            >
              <Button type="link">
                <div>{record.awb}</div>
              </Button>
            </a>
          )}
          <span>{record?.shippingPartner || "No Partner"}</span>
        </>
      ),
    },
    {
      title: "Customer Info",
      dataIndex: "customerName",
      ...getColumnSearchProps("customerName"),
      render: (text, order) => (
        <>
          <div>{order.customerName}</div>
          <div>{order.customerPhone}</div>
        </>
      ),
    },
    {
      title: "Payment Details",
      dataIndex: "paymentMethod",
      filters: [
        { text: "COD", value: "COD" },
        { text: "Prepaid", value: "Prepaid" },
      ],
      onFilter: (value, record) => record.paymentMethod === value,
      render: (text, order) => (
        <>
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
        </>
      ),
    },
    {
      title: "Package Details",
      render: (text, order) => (
        <>
          <div>pkg Wt. {order.weight}gm</div>
          <div>
            ({order.length}x{order.breadth}x{order.height}cm)
          </div>
        </>
      ),
    },
    {
      title: "Channel",
      dataIndex: "channel",
      render: (text) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
            src={text === "shopify" ? Shopify : text === "Mannual" ? logo : Woo}
            alt={text}
            style={{
              width: "max-content",
              height: "40px",
              borderRadius: "50%",
            }}
          />
        </div>
      ),
    },
    // {
    //   title: "Order Date",
    //   dataIndex: "createdAt",
    //   sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
    //   render: (text, order) => (
    //     <>
    //       <div>
    //         {moment(order?.createdAt).format("DD-MM-YYYY")}
    //         <span style={{ marginLeft: "10px", fontStyle: "italic" }}>
    //           {moment(order?.createdAt).format("HH:mm")}
    //         </span>
    //       </div>
    //     </>
    //   ),
    // },
    {
      title: "Order Date",
      dataIndex: "createdAt",
      ...getColumnSearchProps("createdAt"),

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
      onFilter: (value, record) => {
        const [startDate, endDate] = value;
        const orderDate = moment(record.createdAt).toISOString();
        return orderDate >= startDate && orderDate <= endDate;
      },
      render: (text, order) => (
        <>
          <div>
            {moment(order?.createdAt).format("DD-MM-YYYY")}
            <span style={{ marginLeft: "10px", fontStyle: "italic" }}>
              {moment(order?.createdAt).format("HH:mm")}
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
    ...(authUser?.role === "admin"
      ? [
          {
            title: "Action",
            render: (_, record) => (
              <DeleteOutlined
                style={{ color: "red", marginLeft: "1rem", cursor: "pointer" }}
                onClick={() => showDeleteConfirm(record._id)}
              />
            ),
            className: "centered-row",
          },
        ]
      : []),
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
  };
  //console.log(dataSource);

  const allOrders = dataSource?.filter((order) => order?.status === "Shipped");
  console.log(selectedRowKeys);
  //console.log(allOrders);

  return (
    <>
      <Helmet>
        <title>Orders</title>
      </Helmet>
      <div style={{ marginBottom: 16 }}>
        {selectedRowKeys.length > 0 && (
          <Button
            type="danger"
            onClick={handleBulkDelete}
            disabled={selectedRowKeys.length === 0}
          >
            Delete Selected
          </Button>
        )}
      </div>
      {loading ? (
        <Skeleton
          active
          title={false}
          paragraph={{ rows: 10 }}
          style={{ height: "100%", width: "100%" }}
        />
      ) : (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataSource}
          rowKey="_id"
          scroll={{ x: 1050, y: 440 }}
          style={{ marginTop: "-25px" }}
        />
      )}
    </>
  );
};

export default AllOrderComponent;
