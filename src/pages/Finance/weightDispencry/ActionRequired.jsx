import { Button, notification, Table } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../../context/AuthContext";
import UploadDiscrepancyImagesModal from "./UploadDiscrepancyImagesModal";

const ActionRequired = ({
  dataSource,
  rowSelection,
  fetchWeightDespensory,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDiscrepancyId, setSelectedDiscrepancyId] = useState(null);
  const [selectedProductName, setSelectedProductName] = useState(null);
  const { authUser } = useAuthContext();
  const actionRequired = dataSource?.filter(
    (data) => data.status === "action required"
  );
  console.log("action req", actionRequired);

  useEffect(() => {
    const updateStatusToClosed = async () => {
      const entriesToUpdate = [];

      actionRequired.forEach((newEntry) => {
        // Check for duplicates
        const duplicateEntry = actionRequired.find(
          (entry) =>
            entry.awbNumber === newEntry.awbNumber &&
            entry.orderId === newEntry.orderId &&
            entry._id !== newEntry._id &&
            entry.status !== "closed"
        );

        // Calculate if the entry is older than 7 days
        // const isOlderThan7Days =
        //   moment().diff(moment(newEntry.updatedAt), "days") > 7;
        console.log("neww", newEntry);
        // console.log("okkk", isOlderThan7Days);
        // // Add the entry to entriesToUpdate if it has a duplicate or is older than 7 days

        // Check if entry is older than 7 days
        const updatedAt = moment(newEntry.updatedAt);
        const isOlderThan7Days = updatedAt.isValid()
          ? moment().diff(updatedAt, "days") >= 7
          : false;

        console.log("Entry Updated At:", newEntry.updatedAt);
        console.log("Parsed Updated At:", updatedAt.format("YYYY-MM-DD"));
        console.log("Is Older Than 7 Days:", isOlderThan7Days);

        // Add to entriesToUpdate if conditions are met
        if (isOlderThan7Days || duplicateEntry) {
          console.log("Adding to Update:", newEntry);
          entriesToUpdate.push(newEntry);
        }
      });

      console.log("Entries to Update Count:", entriesToUpdate.length);
      console.log("kength", entriesToUpdate.length);

      if (entriesToUpdate.length === 0) return;

      try {
        await Promise.all(
          entriesToUpdate.map(async (entry) => {
            await fetch(
              `http://localhost:5000/api/weightdiscrepancy/updateStatus/${entry._id}`,
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
      title: "Remarks",
      dataIndex: "remarks",
    },
    ...(authUser?.role === "company"
      ? [
          {
            title: "Action",
            dataIndex: "adminData",
            render: (_, record) => (
              <Button
                type="primary"
                onClick={() => {
                  setSelectedDiscrepancyId(record?._id);
                  setSelectedProductName(record?.productName);
                  setModalVisible(true);
                }}
              >
                Take Action
              </Button>
            ),
          },
        ]
      : []),
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

  return (
    <>
      <Table
        className="table"
        scroll={{ x: 1000, y: 300 }}
        dataSource={actionRequired}
        columns={columns}
        rowKey="_id"
        rowSelection={rowSelection}
      />
      <UploadDiscrepancyImagesModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        discrepancyId={selectedDiscrepancyId}
        productName={selectedProductName}
        fetchWeightDespensory={fetchWeightDespensory}
      />
    </>
  );
};

export default ActionRequired;
