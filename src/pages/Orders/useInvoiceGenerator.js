import { useState } from 'react';
import { message } from 'antd';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import moment from 'moment';
import { toWords } from 'number-to-words';

const useInvoiceGenerator = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [invoiceDataList, setInvoiceDataList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInvoiceData = async (ids) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const responses = await Promise.all(
        ids.map(id =>
          fetch(`https://backend.shiphere.in/api/shipping/getinvoice/${id}`, {
            headers: { Authorization: `${token}` },
          })
        )
      );
      const data = await Promise.all(responses.map(response => response.json()));
      setInvoiceDataList(data.map(d => d.invoiceData));
    } catch (error) {
      console.error("Error fetching invoice data:", error);
      message.error('Failed to fetch invoice data.');
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoices = () => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: [595.28, 841.89],
    });

    invoiceDataList.forEach((invoiceData, index) => {
      if (index > 0) {
        pdf.addPage(); // Add a new page for each invoice
      }

      const invoiceElement = document.createElement('div');
      invoiceElement.innerHTML = `
        <div style="padding: 2rem; font-family: Arial, sans-serif;">
          <div style="padding: 12px; border: 1px solid #000000;">
            <h2>Sold By:</h2>
            <p style="font-style: italic;">${invoiceData.sellerName}</p>
            <p style="font-style: italic;">${invoiceData.sellerAddress}</p>
            <p style="font-style: italic;">GSTIN No.: ${invoiceData.sellerGSTIN}</p>
          </div>
          <div style="padding: 12px; border: 1px solid #000000;">
            <h2>Delivered To:</h2>
            <p style="font-style: italic;">${invoiceData.customerName}</p>
            <p style="font-style: italic;">${invoiceData.customerAddress}</p>
          </div>
          <div style="padding: 12px; border: 1px solid #000000;">
            <p style="font-style: italic;"><strong>Invoice No.: </strong>${invoiceData.invoiceNumber}</p>
            <p style="font-style: italic;"><strong>Invoice Date: </strong>${moment(invoiceData.invoiceDate).format('MMMM Do YYYY')}</p>
            <p style="font-style: italic;"><strong>Order Date: </strong>${moment(invoiceData.orderDate).format('MMMM Do YYYY')}</p>
          </div>
          <div style="border: 1px solid #000000; width: 100%; border-collapse: collapse;">
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr>
                  <th style="border: 1px solid #ddd; padding: 5px; background-color: #f4f4f4;">Qty</th>
                  <th style="border: 1px solid #ddd; padding: 5px; background-color: #f4f4f4;">Dimensions</th>
                  <th style="border: 1px solid #ddd; padding: 5px; background-color: #f4f4f4;">Unit Price</th>
                  <th style="border: 1px solid #ddd; padding: 5px; background-color: #f4f4f4;">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="border: 1px solid #ddd; padding: 5px;">${invoiceData.quantity}</td>
                  <td style="border: 1px solid #ddd; padding: 5px;">${invoiceData.dimensions.length}x${invoiceData.dimensions.breadth}x${invoiceData.dimensions.height}</td>
                  <td style="border: 1px solid #ddd; padding: 5px;">${invoiceData.unitPrice}</td>
                  <td style="border: 1px solid #ddd; padding: 5px;">${invoiceData.totalPrice}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style="padding: 7px; border: 1px solid #000000;">
            <p style="font-style: italic;">Net Amount Payable (In Words): <strong>${toWords(invoiceData.totalPrice)}</strong></p>
          </div>
        </div>
      `;

      html2canvas(invoiceElement).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 595.28;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

        if (index === invoiceDataList.length - 1) {
          pdf.save('invoices.pdf');
        }
      });
    });
  };

  const showModall = (ids) => {
    fetchInvoiceData(ids);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  return {
    isModalVisible,
    showModall,
    handleOk,
    downloadInvoices,
    loading,
  };
};

export default useInvoiceGenerator;
