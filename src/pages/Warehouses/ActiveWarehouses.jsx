import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Input, message, Modal, Table, Tag } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, NavLink } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { useWarehouseContext } from "../../context/WarehouseContext";
import "./addWareHouse.css";

const { confirm } = Modal;

const ActiveWarehouses = () => {
  const { warehouse, fetchWarehouse } = useWarehouseContext();
  const { authUser } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState(""); // For global search
  const [filteredWarehouses, setFilteredWarehouses] = useState([]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `process.env.url/api/warehouses/deleteWarehouse/${id}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      message.success("Warehouse deleted successfully");
      fetchWarehouse();
    } catch (error) {
      console.error("Error deleting warehouse:", error);
      message.error("Failed to delete warehouse");
    }
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: "Are you sure you want to delete this warehouse?",
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
  useEffect(() => {
    fetchWarehouse();
  }, []);

  useEffect(() => {
    if (warehouse?.warehouses) {
      handleSearch(searchQuery);
    }
  }, [warehouse, searchQuery]);
  console.log(warehouse);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const lowerCaseQuery = query.toLowerCase();
    const filteredData = warehouse?.warehouses?.filter((wh) => {
      return (
        (wh.warehouseName ?? "").toLowerCase().includes(lowerCaseQuery) ||
        String(wh.smartshipHubId ?? "")
          .toLowerCase()
          .includes(lowerCaseQuery) || // Convert to string
        String(wh.pincode ?? "")
          .toLowerCase()
          .includes(lowerCaseQuery) || // Convert to string
        (wh.contactPerson ?? "").toLowerCase().includes(lowerCaseQuery) ||
        (wh.contactEmail ?? "").toLowerCase().includes(lowerCaseQuery)
      );
    });
    setFilteredWarehouses(filteredData);
  };

  const newOrders = [
    ...(authUser?.email === "test1@gmail.com"
      ? [
          {
            title: "Id",
            dataIndex: "_id",
          },
        ]
      : []),
    {
      title: "Warehouse Name",
      dataIndex: "warehouseName",
    },
    {
      title: "Id ",
      dataIndex: "smartshipHubId",
    },
    {
      title: "Contact Details",
      dataIndex: "contactDetails",
      render: (text, warehouse) => (
        <>
          <div>{warehouse.contactPerson}</div>
          <div>{warehouse.contactEmail}</div>
        </>
      ),
    },
    {
      title: "Pin Code",
      dataIndex: "pincode",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "Active" ? "red" : "green"}>Active</Tag>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, warehouse) => (
        <>
          <NavLink to={`${warehouse?._id}`}>
            <EditOutlined />
          </NavLink>
          <DeleteOutlined
            style={{ color: "red", marginLeft: "1rem", cursor: "pointer" }}
            onClick={() => showDeleteConfirm(warehouse._id)}
          />
        </>
      ),
    },
    ...(authUser?.role === "admin"
      ? [
          {
            title: "Seller",
            dataIndex: "seller",
            render: (text, warehouse) => <div>{warehouse?.seller?.email}</div>,
          },
        ]
      : []),
  ];

  const dataSourceWithKeys = warehouse?.warehouses?.map((warehouse, index) => ({
    ...warehouse,
    key: index.toString(),
  }));

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="keyword" content="" />
        <title>Warehouses</title>
      </Helmet>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          gap: "1rem",
          marginBottom: "1rem",
        }}
        className="warehouse-header"
      >
        <Input
          className="warehouse-search"
          placeholder="Search warehouses"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          enterButton={<SearchOutlined />}
          style={{ width: "300px", minWidth: "200px" }}
        />
        <Button className="warehouse-add-btn">
          <Link to="addwarehouse">Add Warehouse</Link>
        </Button>
      </div>
      <div
        style={{
          backgroundColor: "#fff",
          height: "30rem",
          borderRadius: "1rem",
        }}
        className="warehouse-table-container"
      >
        <Table
          className="warehouse-table"
          columns={newOrders}
          dataSource={filteredWarehouses}
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100", "500", "1000"],
            defaultPageSize: 10,
          }}
          scroll={{ x: 1050, y: 500 }}
          style={{ width: "100%", height: "600px", marginTop: "-10px" }}
        />
      </div>
    </>
  );
};

export default ActiveWarehouses;
