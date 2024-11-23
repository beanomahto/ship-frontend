import React from "react";
import { Table, Input, Button, Space, Tag, Skeleton, DatePicker } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import { Helmet } from "react-helmet";
import Shopify from "../../utils/shopify.png";
import Woo from "../../utils/woocomerce.png";
import logo from "../../utils/logo1.jpg";
import { useAuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const ShipOrderComponent = ({
  rowSelection,
  dataSource,
  fetchOrders,
  loading,
  tab,
}) => {
  //console.log(tab);
  const [searchText, setSearchText] = React.useState("");
  const [searchedColumn, setSearchedColumn] = React.useState("");
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
  const tabs = tab.tab.split(" ")[0];
  //console.log(tabs);
  // manifest , intrasnit
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
      title: "Shipping Status",
      dataIndex: "awb",
      onFilter: (value, record) => record.s_status.indexOf(value) === 0,
      render: (value, record) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {record.shippingPartner && record.awb && (
            <a
              target="_blank"
              href={`/tracking/shipment/${record.shippingPartner}/${record.awb}`}
            >
              <Button type="link">{record.awb ? record.awb : "no"}</Button>
            </a>
          )}
          <span>
            {record?.shippingPartner ? record?.shippingPartner : "no partner"}
          </span>
        </div>
      ),
      className: "centered-row",
    },
    // {
    //   title: 'Status',
    //   dataIndex: 'status',
    //   className: 'centered-row',
    // },
    {
      title: "Customer Info",
      dataIndex: "customerName",
      ...getColumnSearchProps("customerName"),
      render: (text, order) => (
        <div>
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
    // {
    //   title: 'Order Date',
    //   dataIndex: 'createdAt',
    //   sorter: (a, b) => moment(a.updatedAt).isAfter(moment(b.updatedAt)) ? 1 : -1,
    //   render: (text, order) => (
    //     <div>{formatDateInIST(order?.updatedAt)}</div>
    //   ),
    // },
    {
      title: "Order Date",
      dataIndex: "updatedAt",
      ...getColumnSearchProps("updatedAt"),
      sorter: (a, b) => moment(a.updatedAt).unix() - moment(b.updatedAt).unix(),
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

  const shippedOrders = dataSource?.filter(
    (order) => order?.status === "Shipped"
  );
  //console.log(shippedOrders);

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
          rowSelection={rowSelection}
          columns={columns}
          dataSource={shippedOrders}
          className="centered-table"
          rowKey="_id"
          scroll={{ x: 1050, y: 400 }}
          pagination={{
            showSizeChanger: true,
          }}
          style={{ width: "100%", height: "505px", marginTop: "-10px" }}
        />
      )}
    </>
  );
};

export default ShipOrderComponent;
