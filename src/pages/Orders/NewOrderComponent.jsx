import {
  DeleteOutlined,
  SearchOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Input,
  message,
  Modal,
  Progress,
  Skeleton,
  Space,
  Table,
  Tag,
} from "antd";
import Column from "antd/es/table/Column";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import useCreateShipment from "../../hooks/useCreateShipment";
import AS from "../../utils/amazon-shipping.png";
import BD from "../../utils/bluedart.png";
import DLVRY from "../../utils/delhivery.png";
import Dtdc from "../../utils/dtdc.png";
import EE from "../../utils/ecom-express.png";
import Ekart from "../../utils/ekart.jpeg";
import logo from "../../utils/logo1.jpg";
import SF from "../../utils/shadowFax.png";
import Shopify from "../../utils/shopify.png";
import SM from "../../utils/shree-maruti.jpeg";
import Woo from "../../utils/woocomerce.png";
import XPB from "../../utils/xpressbees.png";
const partnerImages = {
  "Blue Dart": BD,
  Delhivery: DLVRY,
  "Amazon Shipping": AS,
  "Ecom Express": EE,
  "Shree Maruti": SM,
  Xpressbees: XPB,
  Ekart: Ekart,
  DTDC: Dtdc,
  Shadowfax: SF,
};

const { confirm } = Modal;
const channelImages = {
  Shopify: Shopify,
};

const NewOrderComponent = ({
  tab,
  dataSource,
  fetchWarehouse,
  rowSelection,
  fetchOrders,
  loading,
  setModalLoading,
  modalLoading,
  deliveryCosts,
  setDeliveryCosts,
  setSelectedOrderId,
  selectedOrderId,
  currentDeliveryCost,
  setCurrentDeliveryCost,
  warehouse,
  selectedWarehouse,
  selectedWarehouseId,
  selectedOrderData,
}) => {
  console.log("There is the delivery cost" + deliveryCosts);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  rowSelection = { ...rowSelection, columnWidth: 90 };

  //console.log(currentDeliveryCost);
  //console.log(warehouse);
  //console.log(selectedWarehouseId);

  useEffect(() => {
    fetchWarehouse();
    //console.log("use Efffff");
  }, []);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { authUser, fetchBalance } = useAuthContext();
  const { shipOrder, error } = useCreateShipment();

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
      // Split the dataIndex in case it represents a nested field
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
        `${import.meta.env.VITE_API_URL}/api/orders/deleteOrder/${id}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      message.success("Order deleted successfully");
      fetchOrders(); // Refresh orders after deletion
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
        console.log("Cancel deletion");
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
      className: "centered-row",
    },
    {
      title: "Order Status",
      dataIndex: "o_status",
      render: (text, order) => (
        <Tag
          style={{
            display: "flex",
            justifyContent: "center",
            maxWidth: "max-content",
            marginLeft: "3rem",
          }}
          color={order.status === "New" ? "green" : "volcano"}
        >
          {order.status}
        </Tag>
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
            flexDirection: "column",
            alignItems: "center",
            maxWidth: "4.5rem",
            marginLeft: "1rem",
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
      ),
      className: "centered-row",
    },
    {
      title: "Package Details",
      render: (text, order) => (
        <div
          style={{
            fontFamily: "Poppins",
            fontSize: ".9rem",
            fontWeight: "500",
            textAlign: "center",
          }}
        >
          <div>pkg Wt. {order.weight}gm</div>
          <div>
            ({order.length}x{order.breadth}x{order.height}cm)
          </div>
        </div>
      ),
      className: "centered-row",
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
      className: "centered-row",
    },

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
    ...(authUser?.role !== "admin"
      ? [
          {
            title: "Quick Assign",
            dataIndex: "q_assign",
            render: (text, order) => (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <ThunderboltOutlined
                  ////////////////////////////// ye raha thunderbolt
                  style={{
                    cursor: "pointer",
                    fontSize: "1.5rem",
                    color: "#08c",
                  }}
                  onClick={() => handleExpandRow(order._id)}
                />
              </div>
            ),
            className: "centered-row",
          },
        ]
      : []),

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

  const handleExpandRow = (key) => {
    setSelectedOrderId(key);
    setIsModalVisible(true);
  };

  const handleAssign = async (partner) => {
    console.log("partner", partner);
    try {
      setModalLoading(true);
      const selectedOrder = dataSource.find(
        (order) => order._id === selectedOrderId
      );

      const { codCost, forwardCost, rtoCost } = partner;

      const gstRate = 0.18;
      const codCostWithGst = codCost * (1 + gstRate);
      const forwardCostWithGst = forwardCost * (1 + gstRate);
      const rtoCostWithGst = rtoCost * (1 + gstRate);
      const totalDebit = forwardCostWithGst + codCostWithGst;

      const sendWarehouse =
        Array.isArray(selectedWarehouseId) && selectedWarehouseId.length === 0
          ? warehouse?.warehouses?.[0]
          : selectedWarehouseId;

      console.log(sendWarehouse);

      try {
        // Attempt to ship the order
        const awb = await shipOrder(
          selectedOrder,
          sendWarehouse,
          partner.deliveryPartner
        );

        console.log("awb in frontend", awb);

        if (awb) {
          console.log(
            "AWB generated successfully, proceeding to deduct amounts"
          );

          // Deduct COD amount if applicable
          if (codCostWithGst > 0) {
            const codWalletRequestBody = {
              debit: codCostWithGst,
              userId: selectedOrder.seller._id,
              remark: `COD charge for order ${selectedOrder.orderId}`,
              orderId: selectedOrder._id,
            };

            const codWalletResponse = await axios.post(
              `${import.meta.env.VITE_API_URL}/api/transactions/decreaseAmount`,
              codWalletRequestBody,
              {
                headers: {
                  Authorization: localStorage.getItem("token"),
                },
              }
            );

            if (codWalletResponse.status !== 200) {
              message.error("Failed to debit COD cost from wallet");
              return;
            }
          }

          // Deduct forward amount
          const forwardWalletRequestBody = {
            debit: forwardCostWithGst,
            userId: selectedOrder.seller._id,
            remark: `Forward charge for order ${selectedOrder.orderId}`,
            orderId: selectedOrder._id,
          };

          const forwardWalletResponse = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/transactions/decreaseAmount`,
            forwardWalletRequestBody,
            {
              headers: {
                Authorization: localStorage.getItem("token"),
              },
            }
          );

          if (forwardWalletResponse.status !== 200) {
            message.error("Failed to debit forward cost from wallet");
            return;
          }

          // Update order status
          const updateBody = {
            awb: awb.awb,
            shippingPartner: partner.deliveryPartner,
            warehouse: sendWarehouse?._id,
            status: "Shipped",
            // shippingCost: totalDebit,
            // rtoCost: rtoCostWithGst,
            shippingCost: forwardCostWithGst,
            rtoCost: rtoCostWithGst,
            codCost: rtoCostWithGst,
          };
          console.log("update body:", updateBody);

          const orderResponse = await axios.put(
            `${
              import.meta.env.VITE_API_URL
            }/api/orders/updateOrderStatus/${selectedOrderId}`,
            updateBody,
            {
              headers: {
                Authorization: `${localStorage.getItem("token")}`,
              },
            }
          );

          if (orderResponse.status === 201) {
            message.success("Shipped successfully");
            fetchOrders();
            fetchBalance();
            setIsModalVisible(false);
            setSelectedOrderId(null);
            setSelectedPartner(null);
          } else {
            throw new Error("Failed to update order status");
          }
        } else {
          throw new Error("AWB generation failed");
        }
      } catch (shippingError) {
        console.error("Shipping process failed:", shippingError);
        message.error(
          shippingError.response?.data?.error || shippingError.message
        );
      }
    } catch (error) {
      message.error(error.response?.data?.error || error.message);
      console.error("Failed to process order assignment:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const newOrders = dataSource?.filter(
    (order) => order.status === "New" || order.status === "Cancelled"
  );
  // console.log(newOrders);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="keyword" content={""} />
        <title>Orders </title>
      </Helmet>

      {loading ? (
        <Skeleton
          active
          title={false}
          paragraph={{ rows: 10 }}
          style={{ height: "100%", width: "100%" }}
        />
      ) : (
        <>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={newOrders}
            scroll={{ x: 1400, y: 400 }}
            pagination={{
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50", "100", "500", "1000"],
              defaultPageSize: 10,
            }}
            style={{ width: "100%", height: "545px", marginTop: "-15px" }}
            rowClassName={(record) =>
              record._id === selectedOrderId ? "selected-row" : ""
            }
            loading={loading}
            className="centered-table"
          />
          <Modal
            title="Assign Delivery Partner"
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null}
            width={1000}
            confirmLoading={modalLoading}
          >
            <Table
              dataSource={deliveryCosts}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              loading={modalLoading}
              scroll={{ x: 800 }}
              style={{ overflowX: "auto" }}
            >
              <Column
                title="Partner"
                dataIndex="deliveryPartner"
                key="deliveryPartner"
                render={(text, record) => (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={partnerImages[record.deliveryPartner]}
                      alt={record.deliveryPartner}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        marginRight: "8px",
                        border: "2px solid #ddd",
                      }}
                    />
                    <p style={{ fontWeight: "500", fontSize: "1rem" }}>
                      {" "}
                      {record.deliveryPartner}
                    </p>
                  </div>
                )}
              />
              <Column
                title="Rating"
                key="rating"
                render={() => (
                  <Progress
                    type="circle"
                    percent={84}
                    format={() => "4.2"}
                    width={40}
                    strokeColor="#52c41a"
                    strokeWidth={8}
                  />
                )}
              />
              <Column
                title="Cost"
                dataIndex="cost"
                key="cost"
                render={(text) => `₹ ${text}`}
              />
              <Column
                title="Action"
                key="action"
                render={(text, record) => (
                  <Button
                    type="primary"
                    onClick={() => handleAssign(record)}
                    disabled={selectedPartner === record}
                    style={{ cursor: "pointer" }}
                  >
                    Assign
                  </Button>
                )}
              />
            </Table>
          </Modal>
        </>
      )}
    </>
  );
};

export default NewOrderComponent;
