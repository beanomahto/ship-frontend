import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, message, Modal, Skeleton, Space, Table } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

const { confirm } = Modal;

const BulkUploadComponent = ({ dataSource, fetchOrders, loading, tab }) => {
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
  const [packageDetails, setPackageDetails] = useState({
    length: "",
    breadth: "",
    height: "",
    weight: "",
  });

  const handlePackageDetailChange = (e) => {
    setPackageDetails({
      ...packageDetails,
      [e.target.name]: e.target.value,
    });
  };
  const handleUpload = async () => {
    if (selectedRowKeys.length === 0) {
      message.error("Please select orders to upload");
      return;
    }

    try {
      // Iterate over each selected order
      for (const orderId of selectedRowKeys) {
        // Fetch the current order details first
        const orderResponse = await axios.get(
          `process.env.url/api/orders/${orderId}`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        if (orderResponse.status !== 200) {
          message.error(`Failed to fetch order details for order ${orderId}`);
          continue;
        }

        const orderData = orderResponse.data.order;
        console.log(orderData);

        // Prepare the payload with updated package details, including the rest of the order data
        const updatedOrderData = {
          ...orderData, // Include all original order data
          length: packageDetails.length,
          breadth: packageDetails.breadth,
          height: packageDetails.height,
          weight: packageDetails.weight,
        };
        // console.log(packageDetails);

        console.log(updatedOrderData);

        // Send the update request with the complete order data
        const updateResponse = await axios.put(
          `process.env.url/api/orders/updateOrder/${orderId}`,
          updatedOrderData,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        if (updateResponse.status === 201) {
          message.success(
            `Order ${orderData.productName} updated successfully`
          );
        }
      }

      // Re-fetch the orders after update
      fetchOrders();
    } catch (error) {
      message.error("Error updating orders");
      console.error(error);
    }
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
      ...getColumnSearchProps("productName"),
      render: (value, record) => <>{record.productName}</>,
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
      title: "Package Details",
      render: (text, order) => (
        <>
          <div>{order.productName}</div>
        </>
      ),
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
          <>
            <Button
              type="danger"
              disabled={selectedRowKeys.length === 0}
              onClick={handleUpload}
            >
              Upload
            </Button>
            <div style={{ marginTop: 10 }}>
              <Input
                placeholder="Length"
                name="length"
                value={packageDetails.length}
                onChange={handlePackageDetailChange}
                style={{ width: 120, marginRight: 10 }}
              />
              <Input
                placeholder="Breadth"
                name="breadth"
                value={packageDetails.breadth}
                onChange={handlePackageDetailChange}
                style={{ width: 120, marginRight: 10 }}
              />
              <Input
                placeholder="Height"
                name="height"
                value={packageDetails.height}
                onChange={handlePackageDetailChange}
                style={{ width: 120, marginRight: 10 }}
              />
              <Input
                placeholder="Weight (gm)"
                name="weight"
                value={packageDetails.weight}
                onChange={handlePackageDetailChange}
                style={{ width: 120 }}
              />
            </div>
          </>
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
        />
      )}
    </>
  );
};

export default BulkUploadComponent;
