// import React, { useState, useEffect } from "react";
// import { IoSearch } from "react-icons/io5";
// import { Table, Tag, Button, Input, Space } from "antd";
// import useLogout from "../../hooks/useLogout";
// import "./employee.css";
// function EmployeeDash() {
//   const [users, setUsers] = useState([]);
//   const { loading, logout } = useLogout();
//   // const handleLogout = () => {
//   //   // Clear the token and redirect to login or home page
//   //   localStorage.removeItem("token");
//   //   // Add redirection logic here if needed, e.g., using useNavigate from react-router
//   // };

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         console.log("Authorization Token:", localStorage.getItem("token"));
//         const response = await fetch("https://backend.shiphere.in/api/users", {
//           headers: {
//             Authorization: localStorage.getItem("token"),
//             // Authorization: `Bearer ${token}`,
//           },
//         });

//         const data = await response.json();
//         const companyUsers = data.filter((user) => user.role === "company");
//         console.log(companyUsers);
//         setUsers(companyUsers);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const columns = [
//     {
//       title: "Full Name",
//       dataIndex: "fullName",
//       key: "fullName",
//       render: (_, record) => `${record.firstName} ${record.lastName}`,
//     },
//     {
//       title: "Company Id",
//       dataIndex: "companyId",
//       key: "companyId",
//     },
//     {
//       title: "Company Name",
//       dataIndex: "companyName",
//       key: "companyName",
//     },
//     {
//       title: "Email",
//       dataIndex: "email",
//       key: "email",
//     },
//     {
//       title: "Phone Number",
//       dataIndex: "phoneNumber",
//       key: "phoneNumber",
//     },
//     {
//       title: "Created At",
//       dataIndex: "createdAt",
//       render: (text) => new Date(text).toLocaleString(),
//     },
//     {
//       title: "Verified",
//       dataIndex: "isVerified",
//       render: (text) => (
//         <Tag color={text ? "green" : "geekblue"}>
//           {text ? "Verified" : "Not verified"}
//         </Tag>
//       ),
//     },
//     {
//       title: "Action",
//       key: "action",
//       // render: (_, record) => (
//       //   // <Button onClick={() => handleGetKYC(record._id)}>
//       //   //   <Link to={`/seller/getkyc/${record._id}`}>Get KYC</Link>
//       //   // </Button>
//       // ),
//     },
//   ];
//   return (
//     <div>
//       <div className="header-section">
//         <div className="search-section">
//           <div className="search-bar-container">
//             <input
//               type="text"
//               placeholder="CompanyId"
//               className="search-input"
//             />
//             <button className="search-button">
//               <i className="fas fa-search">
//                 <IoSearch />
//               </i>
//             </button>
//           </div>
//           <div className="search-bar-container">
//             <input
//               type="text"
//               placeholder="Company Name"
//               className="search-input"
//             />
//             <button className="search-button">
//               <i className="fas fa-search">
//                 <IoSearch />
//               </i>
//             </button>
//           </div>
//           <div className="search-bar-container">
//             <input type="text" placeholder="Email" className="search-input" />
//             <button className="search-button">
//               <i className="fas fa-search">
//                 <IoSearch />
//               </i>
//             </button>
//           </div>
//           <div className="search-bar-container">
//             <input
//               type="text"
//               placeholder="Phone Number"
//               className="search-input"
//             />
//             <button className="search-button">
//               <i className="fas fa-search">
//                 <IoSearch />
//               </i>
//             </button>
//           </div>
//           <div className="search-bar-container">
//             <input type="text" placeholder="Date" className="search-input" />
//             <button className="search-button">
//               <i className="fas fa-search">
//                 <IoSearch />
//               </i>
//             </button>
//           </div>
//           <Button className="logout-button" onClick={logout}>
//             Logout
//           </Button>
//         </div>

//         <div className="table-container">
//           <Table
//             className="custom-table"
//             dataSource={users}
//             columns={columns}
//             rowKey="_id"
//             pagination={true}
//             scroll={{ x: 1000, y: 500 }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default EmployeeDash;

// import React, { useState, useEffect } from "react";
// import { IoSearch } from "react-icons/io5";
// import { Table, Tag, Button } from "antd";
// import useLogout from "../../hooks/useLogout";
// import { AiOutlineInteraction } from "react-icons/ai";
// import { useNavigate } from "react-router-dom";
// import { useOrderContext } from "../../context/OrderContext";
// import useLogin from "../../hooks/useLogin";
// import "./employee.css";

// function EmployeeDash() {
//   // const [users, setUsers] = useState([]);
//   // const { loading, logout } = useLogout();
//   // const navigate = useNavigate(); // Initialize useNavigate
//   // const { fetchOrders } = useOrderContext();
//   // useEffect(() => {
//   //   const fetchUsers = async () => {
//   //     try {
//   //       console.log("Authorization Token:", localStorage.getItem("token"));
//   //       const response = await fetch("https://backend.shiphere.in/api/users", {
//   //         headers: {
//   //           Authorization: localStorage.getItem("token"),
//   //         },
//   //       });

//   //       const data = await response.json();
//   //       const companyUsers = data.filter((user) => user.role === "company");
//   //       console.log(companyUsers);
//   //       setUsers(companyUsers);
//   //     } catch (error) {
//   //       console.error("Error fetching users:", error);
//   //     }
//   //   };

//   //   fetchUsers();
//   // }, []);

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   const userData = await login(email, password);
//   //   console.log("User data received:", userData);

//   //     // Default redirection for other users
//   //     fetchOrders();
//   //     navigate("/");

//   // };
//   // const columns = [
//   //   {
//   //     title: "Full Name",
//   //     dataIndex: "fullName",
//   //     key: "fullName",
//   //     render: (_, record) => `${record.firstName} ${record.lastName}`,
//   //   },
//   //   {
//   //     title: "Company Id",
//   //     dataIndex: "companyId",
//   //     key: "companyId",
//   //   },
//   //   {
//   //     title: "Company Name",
//   //     dataIndex: "companyName",
//   //     key: "companyName",
//   //   },
//   //   {
//   //     title: "Email",
//   //     dataIndex: "email",
//   //     key: "email",
//   //   },
//   //   {
//   //     title: "Phone Number",
//   //     dataIndex: "phoneNumber",
//   //     key: "phoneNumber",
//   //   },
//   //   {
//   //     title: "Created At",
//   //     dataIndex: "createdAt",
//   //     render: (text) => new Date(text).toLocaleString(),
//   //   },
//   //   {
//   //     title: "Verified",
//   //     dataIndex: "isVerified",
//   //     render: (text) => (
//   //       <Tag color={text ? "green" : "geekblue"}>
//   //         {text ? "Verified" : "Not verified"}
//   //       </Tag>
//   //     ),
//   //   },
//   //   {
//   //     title: "Action",
//   //     key: "action",
//   //     render: (_, record) => (
//   //       <AiOutlineInteraction
//   //         onClick={handleSubmit} // Navigate to the specific dashboard
//   //         style={{ cursor: "pointer", fontSize: "24px", color: "#1890ff" }} // Styling the icon
//   //       />
//   //     ),
//   //   },
//   // ];

//   const [users, setUsers] = useState([]);
//   const { loading, logout } = useLogout();
//   const navigate = useNavigate(); // Initialize useNavigate
//   const { fetchOrders } = useOrderContext();
//   const { login } = useLogin();
//   const [searchtext, setsearchtext] = useState("");

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         console.log(
//           "Authorization Token:",
//           localStorage.getItem("employee-token")
//         );
//         const response = await fetch("https://backend.shiphere.in/api/users", {
//           headers: {
//             Authorization: localStorage.getItem("employee-token"),
//           },
//         });

//         const data = await response.json();
//         const companyUsers = data.filter((user) => user.role === "company");
//         console.log(companyUsers);
//         setUsers(companyUsers);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };

//     fetchUsers();
//   }, []);

//   // const handleActionClick = async (record) => {
//   //   const { email } = record; // Get email or ID from the record
//   //   try {
//   //     // Fetch user credentials from your API (or directly use stored credentials)
//   //     const response = await fetch(
//   //       `https://backend.shiphere.in/api/auth/getPassword`,
//   //       {
//   //         method: "POST",
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //         },
//   //         body: JSON.stringify({ email }), // Send email to get the password
//   //       }
//   //     );

//   //     if (response.ok) {
//   //       const userData = await response.json(); // Get user data
//   //       console.log("User data received:", userData);

//   //       // Use seller's email and password to log in
//   //       const sellerLoginResponse = await fetch(
//   //         "https://backend.shiphere.in/api/auth/login",
//   //         {
//   //           method: "POST",
//   //           headers: {
//   //             "Content-Type": "application/json",
//   //           },
//   //           body: JSON.stringify({
//   //             email: userData.email,
//   //             password: userData.password,
//   //             isHashed: true,
//   //           }), // Assuming you have these values
//   //         }
//   //       );

//   //       if (sellerLoginResponse.ok) {
//   //         const sellerTokenData = await sellerLoginResponse.json();
//   //         localStorage.setItem("sellerToken", sellerTokenData.token); // Store seller token

//   //         // Redirect to seller's dashboard
//   //         navigate(`/`); // Adjust the route as needed
//   //       } else {
//   //         console.error("Failed to log in as seller");
//   //       }
//   //     } else {
//   //       console.error("Failed to fetch seller credentials");
//   //     }
//   //   } catch (error) {
//   //     console.error("Error:", error);
//   //   }
//   // };

//   // const handleActionClick = async (record) => {
//   //   const { email } = record; // Get email or ID from the record
//   //   const { login } = useLogin(); // Use the login hook

//   //   try {
//   //     // Fetch user credentials from your API (or directly use stored credentials)
//   //     const response = await fetch(
//   //       `https://backend.shiphere.in/api/auth/getPassword`,
//   //       {
//   //         method: "POST",
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //         },
//   //         body: JSON.stringify({ email }), // Send email to get the password
//   //       }
//   //     );

//   //     if (response.ok) {
//   //       const userData = await response.json(); // Get user data
//   //       console.log("User data received:", userData);

//   //       // Use seller's email and password to log in via the login hook
//   //       const loginData = await login(userData.email, userData.password);

//   //       if (loginData) {
//   //         localStorage.setItem("sellerToken", loginData.token); // Store seller token separately if needed
//   //         // Redirect to seller's dashboard
//   //         navigate(`/seller-dashboard`); // Adjust the route as needed
//   //       } else {
//   //         console.error("Failed to log in as seller");
//   //       }
//   //     } else {
//   //       console.error("Failed to fetch seller credentials");
//   //     }
//   //   } catch (error) {
//   //     console.error("Error:", error);
//   //   }
//   // };
//   const handleActionClick = async (record) => {
//     const { email } = record; // Get email from the record

//     try {
//       // Fetch user credentials from your API
//       const response = await fetch(
//         `https://backend.shiphere.in/api/auth/getPassword`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ email }), // Send email to get the password
//         }
//       );

//       if (response.ok) {
//         const userData = await response.json(); // Get user data
//         console.log("User data received:", userData);

//         // Use seller's email and password to log in via the login hook
//         const isHashed = true;
//         const loginData = await login(
//           userData.email,
//           userData.password,
//           isHashed
//         );

//         if (loginData) {
//           // localStorage.setItem("token", loginData.token); // Store seller token separately if needed
//           // Redirect to seller's dashboard
//           fetchOrders();
//           navigate(`/`); // Adjust the route as needed
//         } else {
//           console.error("Failed to log in as seller");
//         }
//       } else {
//         console.error("Failed to fetch seller credentials");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   const handlesearchChange = (e) => {
//     setsearchtext(e.target.value);
//   };
//   const columns = [
//     {
//       title: "Full Name",
//       dataIndex: "fullName",
//       key: "fullName",
//       render: (_, record) => `${record.firstName} ${record.lastName}`,
//     },
//     {
//       title: "Company Id",
//       dataIndex: "companyId",
//       key: "companyId",
//     },
//     {
//       title: "Company Name",
//       dataIndex: "companyName",
//       key: "companyName",
//     },
//     {
//       title: "Email",
//       dataIndex: "email",
//       key: "email",
//     },
//     {
//       title: "Phone Number",
//       dataIndex: "phoneNumber",
//       key: "phoneNumber",
//     },
//     {
//       title: "Created At",
//       dataIndex: "createdAt",
//       render: (text) => new Date(text).toLocaleString(),
//     },
//     {
//       title: "Verified",
//       dataIndex: "isVerified",
//       render: (text) => (
//         <Tag color={text ? "green" : "geekblue"}>
//           {text ? "Verified" : "Not verified"}
//         </Tag>
//       ),
//     },
//     {
//       title: "Action",
//       key: "action",
//       render: (_, record) => (
//         <AiOutlineInteraction
//           onClick={() => handleActionClick(record)} // Call handleActionClick with record
//           style={{ cursor: "pointer", fontSize: "24px", color: "#1890ff" }} // Styling the icon
//         />
//       ),
//     },
//   ];

//   return (
//     <div>
//       <div className="header-section">
//         <div className="search-section">
//           <div className="search-bar-container">
//             <input
//               type="text"
//               placeholder="Search CompanyId"
//               className="search-input"
//               value={searchtext}
//               onChange={handlesearchChange}
//             />
//             <button className="search-button">
//               <i className="fas fa-search">
//                 <IoSearch />
//               </i>
//             </button>
//           </div>

//           <Button className="logout-button" onClick={logout} loading={loading}>
//             Logout
//           </Button>
//         </div>

//         <div className="table-container">
//           <Table
//             className="custom-table"
//             dataSource={users}
//             columns={columns}
//             rowKey="_id"
//             pagination={true}
//             scroll={{ x: 1000, y: 500 }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default EmployeeDash;

import React, { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { Table, Tag, Button } from "antd";
// import useLogout from "../../hooks/useLogout";
import { AiOutlineInteraction } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useOrderContext } from "../../context/OrderContext";
import useLogin from "../../hooks/useLogin";
import "./employee.css";

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
        console.log(
          "Authorization Token:",
          localStorage.getItem("employee-token")
        );
        const response = await fetch("https://backend.shiphere.in/api/users", {
          headers: {
            Authorization: localStorage.getItem("employee-token"),
          },
        });

        const data = await response.json();
        const companyUsers = data.filter((user) => user.role === "company");
        setUsers(companyUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
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
        <AiOutlineInteraction
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
