import { Button, DatePicker, Input, Table } from "antd";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { CSVLink } from "react-csv";
import { Helmet } from "react-helmet";
import CustomButton from "../../../components/Button/Button";
import { useAuthContext } from "../../../context/AuthContext";
import "./codremmitance.css";
import EarlyCodPopup from "./EarlyCodPopup";
import RemmitanceData from "./RemmitanceData";
import UploadCodRemittance from "./UploadCodRemittance";

const { Search } = Input;

const CodRemmitance = () => {
  const { authUser } = useAuthContext();
  const [remittanceData, setRemittanceData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [earlyCodVisible, setEarlyCodVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchRemittance = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "process.env.url/api/remittance/getremittance",
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        const data = await res.json();
        setRemittanceData(data);
      } catch (error) {
        console.error("Failed to fetch remittance data:", error);
      }
    };
    fetchRemittance();
  }, []);

  const showModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  const showSearchModal = () => setSearchModalVisible(true);
  const closeSearchModal = () => setSearchModalVisible(false);
  const showEarlyCodModal = () => setEarlyCodVisible(true);
  const closeEarlyCodModal = () => setEarlyCodVisible(false);

  const matchesSearchText = (record, searchText) => {
    const lowercasedText = searchText.toLowerCase();
    return (
      record?.seller?.email?.toLowerCase().includes(lowercasedText) ||
      moment(record?.remittances?.createdAt)
        .format("DD-MM-YYYY")
        .includes(lowercasedText) ||
      record?.refId?.toLowerCase().includes(lowercasedText) ||
      record?.generatedCOD?.toString().toLowerCase().includes(lowercasedText) ||
      record?.ecodCharge?.toString().toLowerCase().includes(lowercasedText) ||
      record?.netCODAmt?.toString().toLowerCase().includes(lowercasedText) ||
      record?.amountPaid?.toString().toLowerCase().includes(lowercasedText) ||
      record?.transactionDetail?.toLowerCase().includes(lowercasedText) ||
      record?.count?.toString().toLowerCase().includes(lowercasedText) ||
      record?.status?.toLowerCase().includes(lowercasedText)
    );
  };

  const filteredData = useMemo(() => {
    return (
      remittanceData.remittances?.filter((record) =>
        matchesSearchText(record, searchText)
      ) || []
    );
  }, [remittanceData.remittances, searchText]);

  const generateCsvData = () => {
    return filteredData.map((record) => ({
      "Seller Id": record.seller.email,
      "Generated Date": moment(record?.remittances?.createdAt).format(
        "DD-MM-YYYY"
      ),
      "Ref ID": record.refId,
      "Generated COD": record.generatedCOD,
      "ECOD Charge": record.ecodCharge,
      "Net COD Amt": record.netCODAmt,
      "Amount Paid": record.amountPaid,
      "Transaction Detail": record.transactionDetail,
      Count: record.count,
      Status: record.status,
    }));
  };

  const newOrders = [
    ...(authUser?.role === "admin"
      ? [
          {
            title: "Seller",
            dataIndex: "adminData",
            render: (text, remittance) => (
              <span>{remittance.seller.email}</span>
            ),
          },
        ]
      : []),
    // {
    //   title: "Generated Date",
    //   dataIndex: "generatedDate",
    //   render: (text, remittance) =>
    //     moment(remittance?.remittances?.createdAt).format("DD-MM-YYYY"),
    // },
    {
      title: "Generated Date",
      dataIndex: "generatedDate",

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
            <div style={{ display: "flex", justifyContent: "space-between" }}>
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
                  setRangePickerValue(null);
                }}
                size="small"
                style={{ width: 90 }}
              >
                Reset
              </Button>
            </div>
          </div>
        );
      },
      onFilter: (value, record) => {
        const [startDate, endDate] = value;
        const recordDate = moment(record.remittances?.createdAt).toISOString();
        return recordDate >= startDate && recordDate <= endDate;
      },
      render: (text, remittance) => (
        <div>
          {moment(remittance?.remittances?.createdAt).format("DD-MM-YYYY")}
          <span style={{ marginLeft: "10px", fontStyle: "italic" }}>
            {moment(remittance?.remittances?.createdAt).format("HH:mm")}
          </span>
        </div>
      ),
    },
    {
      title: "Ref ID",
      dataIndex: "refId",
    },
    {
      title: "Generated COD",
      dataIndex: "generatedCOD",
    },
    {
      title: "ECOD Charge",
      dataIndex: "ecodCharge",
    },
    {
      title: "Net COD Amt",
      dataIndex: "netCODAmt",
    },
    {
      title: "Amount Paid",
      dataIndex: "amountPaid",
    },
    {
      title: "Transaction Detail",
      dataIndex: "transactionDetail",
    },
    {
      title: "Count",
      dataIndex: "count",
      render: (text, data) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            fontFamily: "sans-serif",
            fontSize: "1rem",
            marginRight: "3rem",
          }}
        >
          {data.count}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
  ];

  return (
    <div className="cod-remittance">
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="keyword" content={""} />
        <title>COD Remittance</title>
      </Helmet>
      <div className="header-buttons">
        <UploadCodRemittance visible={modalVisible} onClose={closeModal} />
        {/* Uncomment if needed
        <CustomButton onClick={showSearchModal}>Search Seller</CustomButton>
        <SearchSellerModal visible={searchModalVisible} remittanceData={remittanceData} onClose={closeSearchModal} /> */}
      </div>
      <div className="search-and-actions">
        <div className="search-actions">
          <Search
            placeholder="Search across all fields"
            onSearch={(value) => setSearchText(value)}
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
            style={{ width: 300 }}
          />
          <div>
            <Button
              onClick={() => setSearchText("")}
              style={{
                borderRadius: "10px",
                border: "1px solid rgb(36, 136, 243)",
              }}
            >
              X
            </Button>
            {filteredData.length > 0 && (
              <CSVLink
                data={generateCsvData()}
                filename={"filtered_remittance_data.csv"}
                className="ant-btn ant-btn-primary"
                style={{ backgroundColor: "transparent" }}
              >
                <Button
                  style={{
                    borderRadius: "10px",
                    marginLeft: "16px",
                    border: "1px solid rgb(55, 147, 246)",
                  }}
                >
                  Download CSV
                </Button>
              </CSVLink>
            )}
          </div>
        </div>
        <div className="right-actions">
          <Button
            style={{
              borderRadius: "10px",
              border: "1px solid rgb(55, 147, 246)",
            }}
            onClick={showEarlyCodModal}
          >
            Early COD
          </Button>
          <CustomButton onClick={showModal}>Upload Remittance</CustomButton>
        </div>
      </div>
      <RemmitanceData remittanceData={filteredData} />
      <Table
        className="table"
        scroll={{ x: 1000, y: 350 }}
        columns={newOrders}
        dataSource={filteredData}
        rowKey="id"
        pagination={false}
      />
      <EarlyCodPopup visible={earlyCodVisible} onClose={closeEarlyCodModal} />
    </div>
  );
};

export default CodRemmitance;
