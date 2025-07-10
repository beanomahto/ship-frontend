import { UploadOutlined } from "@ant-design/icons";
import { Button, Modal, Upload, message } from "antd";
import axios from "axios";
import React, { useState } from "react";
import DownloadLink from "react-download-link";
import * as XLSX from "xlsx";
import { useAuthContext } from "../../../context/AuthContext";
import { useOrderContext } from "../../../context/OrderContext";

const UploadWeightDespensory = ({
  visible,
  onClose,
  fetchWeightDespensory,
}) => {
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState("");
  const [extractedData, setExtractedData] = useState([]);
  const [sellerIdMap, setSellerIdMap] = useState({});
  const { fetchBalance } = useAuthContext();
  const { orders } = useOrderContext();

  const handleFileChange = async ({ file }) => {
    setFile(file);

    const reader = new FileReader();
    reader.onload = async () => {
      const data = new Uint8Array(reader.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      if (json.length > 1) {
        const keys = json[0];
        const values = json.slice(1);

        const combined = values.map((row) => {
          return keys.reduce((obj, key, index) => {
            obj[key] = row[index] || "";
            return obj;
          }, {});
        });

        setExtractedData(combined);
        setFileData(JSON.stringify(combined, null, 2));

        const sellerEmails = combined
          .map((item) => item.sellerEmail)
          .filter((email) => email);
        const fetchedSellerIdMap = await fetchSellerIds(sellerEmails);
        setSellerIdMap(fetchedSellerIdMap);
      } else {
        setFileData(
          "Invalid file format. Expected at least one header row and one data row."
        );
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const fetchSellerIds = async (sellerEmails) => {
    const token = localStorage.getItem("token");
    const sellerIdMap = {};

    for (const email of sellerEmails) {
      try {
        const response = await axios.get("process.env.url/api/users/search", {
          params: { query: email },
          headers: {
            Authorization: `${token}`,
          },
        });

        if (response.data && response.data.length > 0) {
          sellerIdMap[email] = response.data[0]._id;
        } else {
          console.warn(`No user found for email: ${email}`);
        }
      } catch (error) {
        console.error(
          `Error fetching user for email ${email}: ${error.message}`
        );
      }
    }

    return sellerIdMap;
  };

  const handleUpload = async () => {
    if (!file) {
      message.error("Please upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "process.env.url/api/weightdiscrepancy/uploadweightdiscrepancy",
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const result = await response.json();

      if (response.ok) {
        message.success("File uploaded successfully!");
        await callDeduceWalletAmount();
        await callIncreaseWalletAmount();
        await fetchWeightDespensory();
        onClose();
      } else {
        message.error(`Failed to upload file: ${result.error}`);
      }
    } catch (error) {
      message.error(`Error: ${error.message}`);
    }
  };

  const callIncreaseWalletAmount = async () => {
    console.log("called inrease");
    try {
      for (const row of extractedData) {
        const { sellerEmail, settledCharges, orderId, remarks } = row;

        if (sellerEmail && settledCharges && orderId) {
          const userId = sellerIdMap[sellerEmail];
          const orderMongoId = orders?.orders?.find(
            (order) => order.orderId.toString() === orderId.toString()
          )?._id;
          console.log(orderMongoId);

          if (!orderMongoId) {
            console.warn(`Order ID not found for orderId: ${orderId}`);
            return null;
          }
          if (userId) {
            const walletRequestBody = {
              credit: settledCharges,
              userId: userId,
              remark:
                remarks ||
                `Settled charges ${settledCharges} added for ${sellerEmail}`,
              orderId: orderMongoId,
            };
            console.log(walletRequestBody);

            const response = await fetch(
              "process.env.url/api/transactions/increaseAmount",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: localStorage.getItem("token"),
                },
                body: JSON.stringify(walletRequestBody),
              }
            );

            if (!response.ok) {
              const errorData = await response.json();
              console.error(
                `Failed to credit wallet amount for ${sellerEmail}: ${errorData.error}`
              );
              message.error(
                `Failed to credit wallet amount for ${sellerEmail}: ${errorData.error}`
              );
            } else {
              message.success(`Wallet amount credited for ${sellerEmail}`);
            }
          } else {
            console.warn(`No userId found for seller email: ${sellerEmail}`);
          }
        } else {
          console.warn(`Skipping row due to missing data:`, row);
        }
      }
    } catch (error) {
      console.error(`Error during wallet crediting: ${error.message}`);
      message.error(`Error during wallet crediting: ${error.message}`);
    }
  };

  const callDeduceWalletAmount = async () => {
    console.log("called deducet");

    try {
      const promises = extractedData.map(async (row) => {
        const { sellerEmail, weightCharges, orderId, remarks } = row;

        if (!sellerEmail || !weightCharges || !orderId) {
          console.warn(`Skipping row due to missing data:`, row);
          return null;
        }
        console.log(orderId);

        const orderMongoId = orders?.orders?.find(
          (order) => order.orderId.toString() === orderId.toString()
        )?._id;
        console.log(orderMongoId);

        if (!orderMongoId) {
          console.warn(`Order ID not found for orderId: ${orderId}`);
          return null;
        }

        const userId = sellerIdMap[sellerEmail];
        if (!userId) {
          console.warn(`User ID not found for sellerEmail: ${sellerEmail}`);
          return null;
        }

        const walletRequestBody = {
          debit: weightCharges,
          userId: userId,
          remark:
            remarks ||
            `Weight charges ${weightCharges} deducted from ${sellerEmail}`,
          orderId: orderMongoId,
        };
        console.log(walletRequestBody);

        try {
          const response = await axios.post(
            "process.env.url/api/transactions/decreaseAmount",
            walletRequestBody,
            {
              headers: {
                Authorization: localStorage.getItem("token"),
              },
            }
          );
          console.log(response);

          if (response.status === 200) {
            message.success(`Wallet amount deducted for ${sellerEmail}`);
          } else {
            console.error(
              `Failed to deduct wallet amount for ${sellerEmail}:`,
              response
            );
            message.error(`Failed to deduct wallet amount for ${sellerEmail}`);
          }
        } catch (error) {
          console.error(
            `Error during API call for ${sellerEmail}: ${error.message}`
          );
          message.error(
            `Error during API call for ${sellerEmail}: ${error.message}`
          );
        }
      });

      await Promise.all(promises);
    } catch (error) {
      console.error(`Error during wallet deduction: ${error.message}`);
      message.error(`Error during wallet deduction: ${error.message}`);
    }
  };

  const downloadFile = () => {
    const header = `"sellerEmail","weightAppliedDate","enteredWeight","enteredDimension","orderId","awbNumber","productName","appliedWeight","weightCharges","settledCharges","remarks"`;
    const row1 = `"seller@email.com","2023_01_01","10.5","10x10x10","ORD123","AWB123","Product1","10","100","95","None"`;
    return `${header}\n${row1}`;
  };
  console.log("okkkkk", fileData);
  return (
    <Modal
      title="Upload"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="download">
          <DownloadLink
            label="Download Weight Dispensory CSV"
            filename="sample.csv"
            exportFile={downloadFile}
            style={{ textDecoration: "none" }}
          />
        </Button>,
        <Button key="submit" type="primary" onClick={handleUpload}>
          Upload
        </Button>,
      ]}
    >
      <Upload
        beforeUpload={() => false}
        onChange={handleFileChange}
        accept=".xlsx"
      >
        <Button icon={<UploadOutlined />}>Select Weight Dispensory</Button>
      </Upload>
    </Modal>
  );
};

export default UploadWeightDespensory;
