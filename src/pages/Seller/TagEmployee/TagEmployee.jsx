

import { Button, Input, Modal, Table, message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdOutlineAssignmentReturned } from "react-icons/md";

const { Search } = Input;

const TagEmployee = ({ visible, onClose, selectedSeller }) => {
  const [allEmployees, setAllEmployees] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  //
  const [assignedSellers, setAssignedSellers] = useState([]);

  useEffect(() => {
    if (visible) {
      fetchAllEmployees();
    }
  }, [visible]);

  const fetchAllEmployees = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/employee/getEmployees`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      setAllEmployees(response.data);
      setSearchResults(response.data); // Show all employees initially
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    const filteredResults = allEmployees.filter(
      (user) =>
        (user.professionalEmail &&
          user.professionalEmail.toLowerCase().includes(value.toLowerCase())) ||
        (user.name && user.name.toLowerCase().includes(value.toLowerCase())) ||
        (user.employeeCode &&
          user.employeeCode.toLowerCase().includes(value.toLowerCase()))
    );
    setSearchResults(filteredResults);
  };
  const handleAssign = async (employee) => {
    if (selectedSeller) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/employee/assignSeller`,
          {
            employeeId: employee._id,
            sellerData: selectedSeller,
          }
        );
        message.success(response.data.message);
      } catch (error) {
        console.error("Error assigning seller:", error);
        message.error(
          error.response.data.message || "Failed to assign seller."
        );
      }
    }
  };

  const columns = [
    {
      title: "First Name",
      dataIndex: "name",
      key: "firstName",
    },
    {
      title: "Email",
      dataIndex: "professionalEmail",
      key: "email",
    },
    {
      title: "Employee Code",
      dataIndex: "employeeCode",
      key: "companyName",
    },
    {
      title: "Assign",
      render: (_, record) => (
        // <AiOutlineInteraction
        //   style={{ cursor: "pointer", fontSize: "24px", color: "#1890ff" }}
        // />
        <MdOutlineAssignmentReturned
          style={{ cursor: "pointer", fontSize: "24px", color: "#1890ff" }}
          onClick={() => handleAssign(record)} // Trigger handleAssign on click
        />
      ),
    },
  ];

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      width={900}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
      ]}
    >
      <Search
        placeholder="Search by email, name, employee code"
        allowClear
        enterButton="Search"
        size="large"
        onSearch={handleSearch}
        style={{ width: "25rem", marginBottom: "1rem" }}
      />
      <Table
        loading={loading}
        columns={columns}
        dataSource={searchResults}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />
    </Modal>
  );
};

export default TagEmployee;
