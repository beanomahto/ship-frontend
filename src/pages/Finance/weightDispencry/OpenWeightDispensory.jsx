import { Table, Button, Modal, Image } from "antd";
import moment from "moment";
import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../../context/AuthContext";

const OpenWeightDispensory = ({ dataSource }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const { authUser } = useAuthContext();
  //console.log(authUser);

  const showModal = (images) => {
    setCurrentImages(images);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    const updateStatusToClosed = async () => {
      const entriesToUpdate = [];

      dataSource.forEach((newEntry) => {
        // Find entries with the same orderId and awb, and status not already "closed"
        const duplicateEntry = dataSource.find(
          (entry) =>
            entry.orderId === newEntry.orderId &&
            entry.awb === newEntry.awb &&
            entry.status !== "closed"
        );

        // Add the entry to entriesToUpdate if a duplicate exists
        if (duplicateEntry) {
          entriesToUpdate.push(newEntry);
        }
      });

      console.log("Entries to Update Count:", entriesToUpdate.length);

      if (entriesToUpdate.length === 0) return;

      try {
        await Promise.all(
          entriesToUpdate.map(async (entry) => {
            await fetch(
              `https://backend.shiphere.in/api/weightdiscrepancy/updateStatus/${entry._id}`,
              {
                method: "PUT",
                headers: {
                  Authorization: localStorage.getItem("token"),
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: "closed" }),
              }
            );
          })
        );

        // Notify success
        notification.success({
          message: "Status Updated",
          description:
            "The status of relevant entries has been updated to Closed.",
        });
      } catch (error) {
        console.error("Error updating status:", error);
        notification.error({
          message: "Update Failed",
          description: "There was an error updating the status.",
        });
      }
    };

    updateStatusToClosed();
  }, [dataSource]);

  const columns = [
    {
      title: "Weight Applied Date",
      dataIndex: "weightAppliedDate",
      render: (text, data) =>
        moment(data?.weightAppliedDate).format("DD-MM-YYYY"),
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
      title: "Updated Date",
      dataIndex: "updatedAt",
      render: (text, data) => moment(data?.updatedAt).format("DD-MM-YYYY"),
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
    },
    {
      title: "Actions",
      render: (text, record) => (
        <Button type="link" onClick={() => showModal(record.images)}>
          <h3 style={{ fontWeight: "600" }}> View Images</h3>
        </Button>
      ),
    },
    ...(authUser?.role === "admin"
      ? [
          {
            title: "Sellers",
            dataIndex: "seller",
            render: (_, record) => <span>{record?.seller?.email}</span>,
          },
        ]
      : []),
  ];

  const openData = dataSource?.filter((data) => data.status === "open");
  //console.log(openData);

  return (
    <>
      <Table
        className="table"
        scroll={{ x: 1400, y: 350 }}
        dataSource={openData}
        columns={columns}
        rowKey="id"
      />
      <Modal
        title="Product Images"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {currentImages?.map((image, index) => (
            <Image
              key={index}
              src={image}
              alt={`Product Image ${index + 1}`}
              style={{ width: "100%", maxWidth: "200px" }}
            />
          ))}
        </div>
      </Modal>
    </>
  );
};

export default OpenWeightDispensory;
