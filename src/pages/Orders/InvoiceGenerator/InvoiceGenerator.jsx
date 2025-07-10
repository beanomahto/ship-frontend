import { Button, Modal } from "antd";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import moment from "moment";
import { toWords } from "number-to-words";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
// import './InvoiceGenerator.css';

const InvoiceGenerator = () => {
  const { id } = useParams(); // Get the ID from the route parameters
  const [invoiceData, setInvoiceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const invoiceRef = useRef(null);

  useEffect(() => {
    // Fetch the invoice data from the API using the ID
    const fetchInvoiceData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `process.env.url/api/shipping/getinvoice/${id}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        const data = await response.json();
        setInvoiceData(data.invoiceData);
      } catch (error) {
        console.error("Error fetching invoice data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoiceData();
  }, [id]);

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const downloadInvoice = () => {
    html2canvas(invoiceRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const imgWidth = 595.28;
      const pageHeight = 841.89;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("invoice.pdf");
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!invoiceData) {
    return <div>Error loading invoice data.</div>;
  }
  const formattedInvoiceDate = moment(invoiceData.invoiceDate).format(
    "MMMM Do YYYY"
  );
  const formattedOrderDate = moment(invoiceData.orderDate).format(
    "MMMM Do YYYY"
  );

  //console.log(invoiceData);

  const totalAmountInWords = toWords(invoiceData?.totalPrice);
  //console.log(totalAmountInWords);

  return (
    <div>
      <Modal
        title="Invoice"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleOk}
        className="custom-modal"
        footer={[
          <Button key="download" type="primary" onClick={downloadInvoice}>
            Download Invoice
          </Button>,
          <Button key="ok" onClick={handleOk}>
            OK
          </Button>,
        ]}
      >
        {invoiceData && (
          <div
            ref={invoiceRef}
            className="invoice-container"
            style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}
          >
            {/* <h1>Invoice</h1> */}
            <div className="invoice-section">
              <div className="invoice-header">
                <div
                  className="sold-by"
                  style={{ padding: "12px", border: "1px solid #000000" }}
                >
                  <h2>Sold By:</h2>
                  <p style={{ fontStyle: "italic", fontWeight: "600" }}>
                    {invoiceData?.sellerName}
                  </p>
                  <p style={{ fontStyle: "italic", fontWeight: "600" }}>
                    {invoiceData?.sellerAddress}
                  </p>
                  <p style={{ fontStyle: "italic", fontWeight: "600" }}>
                    GSTIN No.: {invoiceData?.sellerGSTIN}
                  </p>
                </div>
                <div
                  className="delivered-to"
                  style={{ padding: "12px", border: "1px solid #000000" }}
                >
                  <h2>Delivered To:</h2>
                  <p style={{ fontStyle: "italic", fontWeight: "600" }}>
                    {invoiceData?.customerName}
                  </p>
                  <p style={{ fontStyle: "italic", fontWeight: "600" }}>
                    {invoiceData?.customerAddress}
                  </p>
                </div>
              </div>
              <div
                className="invoice-details"
                style={{ padding: "12px", border: "1px solid #000000" }}
              >
                <p style={{ fontStyle: "italic", fontWeight: "600" }}>
                  <strong>Invoice No.: </strong>
                  {invoiceData.invoiceNumber}
                </p>
                <p style={{ fontStyle: "italic", fontWeight: "600" }}>
                  <strong>Invoice Date: </strong>
                  {formattedInvoiceDate}
                </p>
                <p style={{ fontStyle: "italic", fontWeight: "600" }}>
                  <strong>Order Date: </strong>
                  {formattedOrderDate}
                </p>
              </div>
            </div>
            <div
              className="invoice-items"
              style={{
                border: "1px solid #000000",
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th
                      style={{
                        border: "1px solid #ddd",
                        padding: "5px",
                        backgroundColor: "#f4f4f4",
                      }}
                    >
                      Qty
                    </th>
                    <th
                      style={{
                        border: "1px solid #ddd",
                        padding: "5px",
                        backgroundColor: "#f4f4f4",
                      }}
                    >
                      Dimensions
                    </th>
                    <th
                      style={{
                        border: "1px solid #ddd",
                        padding: "5px",
                        backgroundColor: "#f4f4f4",
                      }}
                    >
                      Unit Price
                    </th>
                    <th
                      style={{
                        border: "1px solid #ddd",
                        padding: "5px",
                        backgroundColor: "#f4f4f4",
                      }}
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ border: "1px solid #ddd", padding: "5px" }}>
                      {invoiceData?.quantity}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "5px" }}>
                      {invoiceData?.dimensions.length}x
                      {invoiceData?.dimensions.breadth}x
                      {invoiceData?.dimensions.height}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "5px" }}>
                      {invoiceData?.unitPrice}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "5px" }}>
                      {invoiceData?.totalPrice}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              className="invoice-footer"
              style={{ padding: "7px", border: "1px solid #000000" }}
            >
              <p style={{ fontStyle: "italic", fontWeight: "600" }}>
                Net Amount Payable (In Words):{" "}
                <strong>{totalAmountInWords}</strong>
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InvoiceGenerator;
