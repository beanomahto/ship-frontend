import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Input,
  Space,
  DatePicker,
  Modal,
  message,
} from "antd";
import { Link } from "react-router-dom";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import { Helmet } from "react-helmet";
import { AiOutlineInteraction } from "react-icons/ai";
import TagEmployee from "./TagEmployee/TagEmployee";
import { FaTags } from "react-icons/fa";
import axios from "axios";
import moment from "moment";

const { confirm } = Modal;

const Seller = () => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);

  //console.log(users);

  // const showModal = () => setModalVisible(true);
  // const closeModal = () => setModalVisible(false);
  const showModal = (seller) => {
    setSelectedSeller(seller); // Set the selected seller when modal opens
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
    setSelectedSeller(null); // Reset selected seller when closing the modal
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("https://backend.shiphere.in/api/users", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      const data = await response.json();
      const companyUsers = data.filter((user) => user.role === "company");
      setUsers(companyUsers);
      // console.log(companyUsers);
      setFilteredUsers(companyUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleGlobalSearch = (query) => {
    setSearchQuery(query);

    const lowerCaseQuery = query.toLowerCase();
    const filteredData = users.filter((user) => {
      const fullName = `${user.firstName ?? ""} ${
        user.lastName ?? ""
      }`.toLowerCase();
      return (
        fullName.includes(lowerCaseQuery) ||
        (user.companyName ?? "").toLowerCase().includes(lowerCaseQuery) ||
        (user.companyId ?? "").toLowerCase().includes(lowerCaseQuery) ||
        (user.email ?? "").toLowerCase().includes(lowerCaseQuery) ||
        (user.phoneNumber ?? "").toLowerCase().includes(lowerCaseQuery)
      );
    });
    // console.log(filteredData);
    setFilteredUsers(filteredData);
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
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    render: (text) =>
      searchedColumn === dataIndex ? (
        <span style={{ backgroundColor: "#ffc069", padding: 0 }}>{text}</span>
      ) : (
        text
      ),
  });
  //console.log(users);
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://backend.shiphere.in/api/users/deleteUser/${id}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      message.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting User:", error);
      message.error("Failed to delete User");
    }
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: "Are you sure you want to delete this User?",
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
  const columns = [
    {
      title: "Full Name",
      // key: 'fullName',
      // ...getColumnSearchProps("fullName"),
      render: (record) => <div>{`${record.firstName} ${record.lastName}`}</div>,
    },
    {
      title: "Company Id",
      dataIndex: "companyId",
      ...getColumnSearchProps("companyId"),
    },
    {
      title: "Company Name",
      dataIndex: "companyName",
      ...getColumnSearchProps("companyName"),
    },
    {
      title: "Email",
      dataIndex: "email",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      ...getColumnSearchProps("phoneNumber"),
    },
    {
      title: "Amount",
      // dataIndex: "amount",
      ...getColumnSearchProps("amount"),
      render: (seller) => (
        <>
          <div>{seller.amount?.toFixed(2)}</div>
        </>
      ),
    },
    // {
    //   title: "Created At",
    //   dataIndex: "createdAt",
    //   render: (text) => new Date(text).toLocaleString(),
    // },
    {
      title: "Created At",
      dataIndex: "createdAt",
      ...getColumnSearchProps("createdAt"),
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
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
    {
      title: "Verified",
      dataIndex: "isVerified",
      filters: [
        { text: "Verified", value: true },
        { text: "Not Verified", value: false },
      ],
      onFilter: (value, record) => record.isVerified === value,
      render: (text) => (
        <Tag color={text ? "green" : "geekblue"}>
          {text ? "Verified" : "Not verified"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button onClick={() => handleGetKYC(record._id)}>
          <Link to={`/seller/getkyc/${record._id}`}>Get KYC</Link>
        </Button>
      ),
    },
    {
      title: "Early COD",
      dataIndex: "earlyCod",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex" }}>
          <FaTags
            onClick={() => showModal(record)}
            style={{ cursor: "pointer", fontSize: "24px", color: "#1890ff" }}
          />
          <DeleteOutlined
            style={{
              color: "red",
              marginLeft: "20px",
              fontSize: "18px",
              cursor: "pointer",
            }}
            onClick={() => showDeleteConfirm(record._id)}
          />
        </div>
      ),
    },
  ];

  const handleGetKYC = (id) => {
    //console.log(`Get KYC for user with id: ${id}`);
  };

  return (
    <div
      style={{ backgroundColor: "#fff", height: "40rem", borderRadius: "1rem" }}
    >
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="keyword" content={""} />
        <title>Sellers</title>
      </Helmet>
      {/* <TagEmployee visible={modalVisible} onClose={closeModal} /> */}
      <TagEmployee
        visible={modalVisible}
        onClose={closeModal}
        selectedSeller={selectedSeller} // Pass selected seller as prop
      />
      <div className="search-container">
        <Input.Search
          style={{marginBottom: "1rem", minWidth: "300px"}}
          className="search-input"
          placeholder="Search globally"
          value={searchQuery}
          onChange={(e) => handleGlobalSearch(e.target.value)}
          onSearch={(value) => handleGlobalSearch(value)}
          enterButton={<SearchOutlined />}
        />
      </div>

      <Table
        className="custom-table"
        dataSource={filteredUsers}
        columns={columns}
        rowKey="_id"
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100", "500", "1000"],
          defaultPageSize: 10,
        }}
        scroll={{ x: 1050, y: 500 }}
        style={{ width: "100%", height: "600px", marginTop: "-10px" }}
      />
    </div>
  );
};

export default Seller;
