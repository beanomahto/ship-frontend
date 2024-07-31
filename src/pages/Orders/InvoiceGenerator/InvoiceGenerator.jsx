import React, { useState, useRef } from 'react';
import { Button, Modal } from 'antd';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './InvoiceGenerator.css'; 

const InvoiceGenerator = () => {
  const [invoiceData, setInvoiceData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const invoiceRef = useRef(null);

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const downloadInvoice = () => {
    html2canvas(invoiceRef.current).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt', 
        format: [595.28, 841.89],
      });
  
      const imgWidth = 595.28; 
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('invoice.pdf');
    });
  };

  const hardcodedInvoiceData = {
    seller: {
      name: "Neeraj Yadav yoga",
      address: "BLOCK Y MANGOLPURI HOUSE NUMBER 841 CHODI GALI NEAR FABI NAAZ CONFECTIONERY STOR, North West Delhi 110083, Delhi, India",
      gstin: "07ABCDE1234F1Z5"
    },
    buyer: {
      name: "Rajeev Singh",
      address: "ANGOLPURI HOUSE NUMBER 841 CHODI GALI NEAR FABI NAAZ CONFECTIONERY",
    },
    invoiceNumber: "Retail00280",
    invoiceDate: "23/07/2024",
    orderNumber: "4864225017",
    orderDate: "03/07/2024",
    paymentMethod: "prepaid",
    shippedBy: "Delhivery Surface",
    awbNumber: "19041610471476",
    items: [
      {
        description: "Test SKU : SHJO1720015",
        hsn: "1234",
        qty: 1,
        unitPrice: 1200,
        total: 1200
      }
    ],
    amountInWords: "One Thousand Two Hundred Rupees",
    jurisdiction: "Delhi"
  };

//   const data = invoiceData || hardcodedInvoiceData;
  const data = hardcodedInvoiceData;

  return (
    <div>
      <Modal
        title="Invoice"
        visible={isModalVisible}
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
          {data && (
         <div ref={invoiceRef} className="invoice-container" style={{padding:'2rem' , fontFamily: 'Arial, sans-serif' }}>
         {/* <h1>Invoice</h1> */}
         <div className="invoice-section">
           <div className="invoice-header">
             <div className="sold-by" style={{padding:'12px',border: '1px solid #000000'}}>
               <h2>Sold By:</h2>
               <p style={{fontStyle:'italic'}}>{data.seller.name}</p>
               <p style={{fontStyle:'italic'}}>{data.seller.address}</p>
               <p style={{fontStyle:'italic'}}>GSTIN No.: {data.seller.gstin}</p>
             </div>
             <div className="delivered-to" style={{padding:'12px',border: '1px solid #000000'}}>
               <h2>Delivered To:</h2>
               <p style={{fontStyle:'italic'}}>{data.buyer.name}</p>
               <p style={{fontStyle:'italic'}}>{data.buyer.address}</p>
             </div>
           </div>
           <div className="invoice-details" style={{padding:'12px',border: '1px solid #000000'}}>
             <p style={{fontStyle:'italic'}}><strong>Invoice No.: </strong>{data.invoiceNumber}</p>
             <p style={{fontStyle:'italic'}}><strong>Invoice Date: </strong>{data.invoiceDate}</p>
             <p style={{fontStyle:'italic'}}><strong>Order No.: </strong>{data.orderNumber}</p>
             <p style={{fontStyle:'italic'}}><strong>Order Date: </strong>{data.orderDate}</p>
           </div>
         </div>
         <div className="invoice-items" style={{ border: '1px solid #000000', width: '100%', borderCollapse: 'collapse' }}>
           <table style={{ width: '100%', borderCollapse: 'collapse' }}>
             <thead>
               <tr>
                 <th style={{ border: '1px solid #ddd', padding: '5px', backgroundColor: '#f4f4f4' }}>Description</th>
                 <th style={{ border: '1px solid #ddd', padding: '5px', backgroundColor: '#f4f4f4' }}>HSN</th>
                 <th style={{ border: '1px solid #ddd', padding: '5px', backgroundColor: '#f4f4f4' }}>Qty</th>
                 <th style={{ border: '1px solid #ddd', padding: '5px', backgroundColor: '#f4f4f4' }}>Unit Price</th>
                 <th style={{ border: '1px solid #ddd', padding: '5px', backgroundColor: '#f4f4f4' }}>Total</th>
               </tr>
             </thead>
             <tbody>
               {data.items.map((item, index) => (
                 <tr key={index}>
                   <td style={{ border: '1px solid #ddd', padding: '5px' }}>{item.description}</td>
                   <td style={{ border: '1px solid #ddd', padding: '5px' }}>{item.hsn}</td>
                   <td style={{ border: '1px solid #ddd', padding: '5px' }}>{item.qty}</td>
                   <td style={{ border: '1px solid #ddd', padding: '5px' }}>{item.unitPrice.toFixed(2)}</td>
                   <td style={{ border: '1px solid #ddd', padding: '5px' }}>{item.total.toFixed(2)}</td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
         <div className="invoice-footer" style={{padding:'7px', border: '1px solid #000000'}}>
           <p style={{fontStyle:'italic'}}>Net Amount Payable (In Words): {data.amountInWords}</p>
           <p style={{fontStyle:'italic'}}>All disputes are subject to {data.jurisdiction} jurisdiction only.</p>
         </div>
       </div>
       
        )}
      </Modal>
    </div>
  );
};

export default InvoiceGenerator;