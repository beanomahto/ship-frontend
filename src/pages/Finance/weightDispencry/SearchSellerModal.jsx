import { Button, Input, message, Modal, Table } from "antd";
import React, { useState } from "react";

const SearchSellerModal = ({ visible, onClose, weightDispensory }) => {
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  console.log("8", weightDispensory.data);
  const handleSearch = () => {
    const filtered = weightDispensory?.data?.filter((weight) =>
      weight?.seller?.email?.toLowerCase().includes(searchValue.toLowerCase())
    );
    console.log("filtered", filtered);
    setFilteredData(filtered);
  };

  const handleDownload = async () => {
    const email = searchValue.trim().toLowerCase();

    if (!email) {
      return message.error(
        "Please enter a valid email to download the report."
      );
    }

    console.log("Email sent to API:", email);

    try {
      const response = await fetch(
        "process.env.url/api/report/weightdispute", // Replace with your actual API endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }), // Send as an array
        }
      );

      if (!response.ok) {
        throw new Error(`Failed with status: ${response.status}`);
      }

      // Create a downloadable link for the Excel file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Weight_Discrepancy_Report_${Date.now()}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      message.success("Report downloaded successfully!");
    } catch (error) {
      console.error("Error downloading report:", error);
      message.error("Failed to download the report.");
    }
  };

  const columns = [
    {
      title: "Weight Applied Date",
      dataIndex: "weightAppliedDate",
    },
    {
      title: "Entered Weight",
      dataIndex: "enteredWeight",
    },
    {
      title: "Entered Dimension",
      dataIndex: "enteredDimension",
    },
    {
      title: "Order Id",
      dataIndex: "orderId",
    },
    {
      title: "AWB Number",
      dataIndex: "awbNumber",
    },
    {
      title: "Product Name",
      dataIndex: "productName",
    },
    {
      title: "Applied Weight",
      dataIndex: "appliedWeight",
    },
    {
      title: "Weight Charges",
      dataIndex: "weightCharges",
    },
    {
      title: "Settled Charges",
      dataIndex: "settledCharges",
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
    },
  ];
  //console.log(filteredData);
  return (
    <Modal
      title="Search Seller Remittance"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width="70rem"
    >
      <Input
        placeholder="Enter seller email"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
        <Button onClick={handleSearch} type="primary">
          Search
        </Button>
        <Button onClick={handleDownload} type="primary" danger>
          Download
        </Button>
      </div>
      <Table
        style={{ marginTop: "20px" }}
        columns={columns}
        scroll={{ x: 1000, y: 190 }}
        dataSource={filteredData}
        rowKey="id"
      />
    </Modal>
  );
};

export default SearchSellerModal;
