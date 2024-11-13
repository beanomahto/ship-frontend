import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Input, Space, message, Modal } from "antd";
import { Link, NavLink } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import { Helmet } from "react-helmet";
import CustomButton from "../../components/Button/Button";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
const Employee = () => {
  const { confirm } = Modal;
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  //console.log(users);
  const handleDelete = async (id) => {
    //console.log(id);

    try {
      await axios.delete(
        `https://backend.shiphere.in/api/employee/deleteEmployee/${id}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      message.success("Employee deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting Employee:", error);
      message.error("Failed to delete Employee");
    }
  };
  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "https://backend.shiphere.in/api/employee/getEmployees",
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  //console.log(users);

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

  const showDeleteConfirm = (id) => {
    confirm({
      title: "Are you sure you want to delete this Employee?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        handleDelete(id);
      },
      onCancel() {
        //console.log("Cancel deletion");
      },
    });
  };

  const columns = [
    {
      title: "Full Name",
      dataIndex: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Professional Email",
      dataIndex: "professionalEmail",
      ...getColumnSearchProps("professionalEmail"),
    },
    {
      title: "Contact",
      dataIndex: "contact",
      ...getColumnSearchProps("contact"),
    },
    {
      title: "Address",
      dataIndex: "address",
      ...getColumnSearchProps("address"),
    },
    {
      title: "Father’s Name",
      dataIndex: "fatherName",
      ...getColumnSearchProps("fatherName"),
    },
    {
      title: "Emergency Contact",
      dataIndex: "emergencyContact",
      ...getColumnSearchProps("emergencyContact"),
    },
    {
      title: "Date of Joining",
      dataIndex: "dateOfJoining",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Employee Code",
      dataIndex: "employeeCode",
      ...getColumnSearchProps("employeeCode"),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, employee) => (
        <>
          <NavLink to={`${employee?._id}`}>
            <EditOutlined />
          </NavLink>
          <DeleteOutlined
            style={{ color: "red", marginLeft: "1rem", cursor: "pointer" }}
            onClick={() => showDeleteConfirm(employee._id)}
          />
        </>
      ),
    },
  ];

  return (
    <div
      style={{ backgroundColor: "#fff", height: "45rem", borderRadius: "1rem" }}
    >
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="keyword" content={""} />
        <title>Employee</title>
      </Helmet>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginRight: "2rem",
        }}
      >
        <CustomButton>
          <NavLink to={"addEmployee"}>Add Employee</NavLink>
        </CustomButton>
      </div>
      <Table
        dataSource={users}
        columns={columns}
        rowKey="_id"
        pagination={false}
        scroll={{ x: 1000 }}
      />
    </div>
  );
};

export default Employee;
