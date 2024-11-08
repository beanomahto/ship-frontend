import React, { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { Table, Tag, Button } from "antd";
// import useLogout from "../../hooks/useLogout";
import { AiOutlineInteraction } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useOrderContext } from "../../context/OrderContext";
import useLogin from "../../hooks/useLogin";
import "./employee.css";
import { FaTags } from "react-icons/fa";

function EmployeeDash() {
  const [users, setUsers] = useState([]);
  // const { loading, logout } = useLogout();
  const navigate = useNavigate(); // Initialize useNavigate
  const { fetchOrders } = useOrderContext();
  const { login } = useLogin();
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("employee-token");
        const response = await fetch(
          "https://backend.shiphere.in/api/employee/getemployeeusers",
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (response.ok) {
          const associatedUsers = await response.json();
          console.log("okokokokok", associatedUsers);
          setUsers(associatedUsers);
        } else {
          console.error("Failed to fetch associated users");
        }
      } catch (error) {
        console.error("Error fetching associated users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleActionClick = async (record) => {
    const { email } = record;
    try {
      const response = await fetch(
        `https://backend.shiphere.in/api/auth/getPassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        const userData = await response.json();
        const isHashed = true;
        const loginData = await login(
          userData.email,
          userData.password,
          isHashed
        );

        if (loginData) {
          fetchOrders();
          navigate(`/`);
        } else {
          console.error("Failed to log in as seller");
        }
      } else {
        console.error("Failed to fetch seller credentials");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  // Filter users based on search text across multiple fields
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return (
      fullName.includes(searchText.toLowerCase()) ||
      user.companyId.toLowerCase().includes(searchText.toLowerCase()) ||
      user.companyName.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase()) ||
      user.phoneNumber.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const logout = () => {
    localStorage.removeItem("employee-token"); // Remove the token
    navigate("/login"); // Redirect to the login page
  };

  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (_, record) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: "Company Id",
      dataIndex: "companyId",
      key: "companyId",
    },
    {
      title: "Company Name",
      dataIndex: "companyName",
      key: "companyName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Verified",
      dataIndex: "isVerified",
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
        <FaTags
          onClick={() => handleActionClick(record)}
          style={{ cursor: "pointer", fontSize: "24px", color: "#1890ff" }}
        />
      ),
    },
  ];

  return (
    <div>
      <div className="header-section">
        <div className="search-section">
          <div className="search-bar-container">
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
              value={searchText}
              onChange={handleSearchChange}
            />
            <button className="search-button">
              <IoSearch color="white" size={15} />
            </button>
          </div>

          <Button className="logout-button" onClick={logout}>
            Logout
          </Button>
        </div>

        <div className="table-container">
          <Table
            className="custom-table"
            dataSource={filteredUsers}
            columns={columns}
            rowKey="_id"
            pagination={true}
            scroll={{ x: 1000, y: 500 }}
          />
        </div>
      </div>
    </div>
  );
}

export default EmployeeDash;
