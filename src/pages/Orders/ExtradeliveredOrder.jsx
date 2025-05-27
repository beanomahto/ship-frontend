import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import {
    Button,
    DatePicker,
    Input,
    Modal,
    Select,
    Skeleton,
    Space,
    Table,
    Tag,
    message,
} from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useAuthContext } from "../../context/AuthContext";
import logo from "../../utils/logo1.jpg";
import Shopify from "../../utils/shopify.png";
import Woo from "../../utils/woocomerce.png";
const { confirm } = Modal;

const ExtradeliveredOrder = () => {
  //console.log(tab);
  const [searchText, setSearchText] = React.useState("");
  const [searchedColumn, setSearchedColumn] = React.useState("");
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const { authUser } = useAuthContext();

  useEffect(() => {
    const fetchDeliveredOrders = async () => {
      try {
        const response = await fetch(
          "https://backend.shiphere.in/api/orders/getdelivered", // Backend endpoint
          {
            method: "POST", // Change to POST to match the backend route
            headers: {
              "Content-Type": "application/json", // Ensure the content type is specified
              Authorization: `${token}`, // Pass the token for authentication
            },
          }
        );

        if (!response.ok) {
          // If the response is not OK, throw an error
          throw new Error(`Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Response", data); // Log the response to verify data
        setDeliveredOrders(data.orders); // Update state with fetched orders
      } catch (err) {
        console.error("Error fetching delivered orders:", err); // Log any errors
        setError(err.message || "Error fetching data"); // Set error state
      } finally {
        setLoading(false); // Set loading to false after the request completes
      }
    };

    fetchDeliveredOrders();
  }, [token]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const formatDateInIST = (dateString) => {
    return moment.utc(dateString).local().format("DD-MM-YYYY HH:mm");
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
  //   const tabs = tab.tab.split(" ")[0];
  //   //console.log(tabs);
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
      render: (text, order) => <div>{order.orderId}</div>,
      className: "centered-row",
    },
    {
      title: "Shipping Status",
      dataIndex: "awb",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        const [awbFilter, setAwbFilter] = React.useState("");
        const [partnerFilter, setPartnerFilter] = React.useState("");

        return (
          <div style={{ padding: 8 }}>
            <Input
              placeholder="Search AWB"
              value={awbFilter}
              onChange={(e) => setAwbFilter(e.target.value)}
              onPressEnter={() => {
                setSelectedKeys([JSON.stringify({ awbFilter, partnerFilter })]);
                confirm();
              }}
              style={{ marginBottom: 8, display: "block" }}
            />
            <Select
              placeholder="Select Partner"
              value={partnerFilter}
              onChange={(value) => {
                setPartnerFilter(value);
                setSelectedKeys([
                  JSON.stringify({ awbFilter, partnerFilter: value }),
                ]);
              }}
              allowClear
              style={{ width: "100%", marginBottom: 8 }}
              options={[
                { value: "", label: "None" },
                { value: "Ecom Express", label: "Ecom Express" },
                { value: "Delhivery", label: "Delhivery" },
                { value: "Blue Dart", label: "Blue Dart" },
                { value: "DTDC", label: "DTDC" },
                { value: "Xpressbees", label: "Xpressbees" },
                { value: "Shadowfax", label: "Shadowfax" },
                { value: "Ekart", label: "Ekart" },
              ]}
            />
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  setSelectedKeys([
                    JSON.stringify({ awbFilter, partnerFilter }),
                  ]);
                  confirm();
                }}
                size="small"
                style={{ width: 90 }}
              >
                Apply
              </Button>
              <Button
                onClick={() => {
                  clearFilters();
                  setAwbFilter("");
                  setPartnerFilter("");
                  confirm();
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
        const { awbFilter, partnerFilter } = JSON.parse(value);

        const lowerAwbFilter = awbFilter?.toLowerCase() || "";
        const lowerPartnerFilter = partnerFilter?.toLowerCase() || "";

        const awbMatches =
          !lowerAwbFilter || record.awb?.toLowerCase().includes(lowerAwbFilter);
        const partnerMatches =
          !lowerPartnerFilter ||
          record.shippingPartner?.toLowerCase() === lowerPartnerFilter;

        return awbMatches && partnerMatches;
      },
      render: (value, record) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {record.awb && record.shippingPartner ? (
            <a
              target="_blank"
              href={`/tracking/shipment/${record.shippingPartner}/${record.awb}`}
            >
              <Button type="link">{record.awb}</Button>
            </a>
          ) : (
            <span>No AWB</span>
          )}
          <span>{record.shippingPartner || "No Partner"}</span>
        </div>
      ),
      className: "centered-row",
    },
    {
      title: "Customer Info",
      dataIndex: "customerName",
      ...getColumnSearchProps("customerName"),
      render: (text, order) => (
        <div>
          {/* <div>{order.status}</div> */}
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
        { text: "Prepaid", value: "Prepaid" },
      ],
      onFilter: (value, record) => record.paymentMethod === value,
      render: (text, order) => (
        <div>
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
        <div>
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
      dataIndex: "statusUpdateDate", // Change dataIndex to statusUpdateDate
      ...getColumnSearchProps("statusUpdateDate"), // Ensure search works with statusUpdateDate
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
        const orderDate = moment(
          record.shipmentDetails.statusUpdateDate
        ).toISOString(); // Update this to use statusUpdateDate
        return orderDate >= startDate && orderDate <= endDate;
      },
      render: (text, order) => {
        console.log(order?.shipmentDetails?.statusUpdateTime);
        return (
          <>
            <div>
              {moment(
                order.shipmentDetails.statusUpdateDate,
                "YYYY-MM-DD"
              ).format("DD-MM-YYYY")}{" "}
              <span style={{ marginLeft: "10px", fontStyle: "italic" }}>
                {moment(
                  order.shipmentDetails.statusUpdateTime,
                  "HH:mm:ss"
                ).format("HH:mm:ss")}
              </span>
            </div>
          </>
        );
      },
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

  //   const shippedOrders = dataSource?.filter(
  //     (order) => order?.status === "Delivered"
  //   );
  //   console.log("delivered", shippedOrders);
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
        <Table
          columns={columns}
          dataSource={deliveredOrders}
          className="centered-table"
          rowKey={(record) => record._id}
          scroll={{ x: 1050, y: 450 }}
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            defaultPageSize: 20,
          }}
        />
      )}
    </>
  );
};

export default ExtradeliveredOrder;
