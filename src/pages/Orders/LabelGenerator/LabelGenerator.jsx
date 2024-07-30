import axios from 'axios';
import { Button, Modal } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './LabelGenerator.css';

const getBase64ImageFromUrl = async (imageUrl) => {
  const res = await fetch(imageUrl);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const LabelGenerator = () => {
  const { id } = useParams();
  const [labelData, setLabelData] = useState(null);
  const [base64Logo, setBase64Logo] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const labelRef = useRef(null);

  useEffect(() => {
    const generateLabel = async () => {
      try {
        const response = await axios.get(`/api/shipping/getlabel/${id}`);
        const logoBase64 = await getBase64ImageFromUrl(response.data.logoUrl);
        setLabelData(response.data);
        setBase64Logo(logoBase64);
        setIsModalVisible(true);
      } catch (error) {
        console.error('Error generating label:', error);
        alert('Error generating label');
      }
    };
    generateLabel();
  }, [id]);

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const downloadLabel = () => {
    html2canvas(labelRef.current).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: [4, 6], 
      });
      pdf.addImage(imgData, 'PNG', 0, 0, 4, 6);
      pdf.save('shipping_label.pdf');
    });
  };

  console.log(labelData);

  return (
    <div>
      <Modal
        title="Shipping Label"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleOk}
        // width={800}
        footer={[
          <Button key="download" type="primary" onClick={downloadLabel}>
            Download Label
          </Button>,
          <Button key="ok" onClick={handleOk}>
            OK
          </Button>,
        ]}
      >
        {labelData && (
          <div ref={labelRef} className="label-container">
            <h1 style={{ textAlign: 'center' }}>Shipping Label</h1>
            <p><strong>Order Id</strong> 123231</p>
         <div style={labelData.logoUrl ? { display: 'flex' } : {}}>
         <div className="section">
              <img style={{ width: '15rem' }} src={`data:image/png;base64,${labelData.barcode}`} alt="Barcode" />
              {/* <img style={{ width: '10rem' }} src={base64Logo} alt="" /> */}
            </div>
         {labelData.logoUrl &&
          <div className="section" style={{Width:'12rem'}} >
          <img style={{ width: '9rem' }} src={base64Logo} alt="" />
        </div>
         }
         </div>
            <div className="section">
              <p><strong>Ship To:</strong><p><strong>Dheeraj Kumar</strong></p> FLAT NO-B16-403, SUPERTECH ECO VILLAGE-2, GH-1 SECTOR-16B, GREATER NOIDA, NOIDA, Gautam Buddha Nagar, Noida, Uttar Pradesh, India, 201301</p>
              <p>{labelData.customerName}</p>
              <p>{labelData.customerAddress}</p>
              <p>{labelData.customerCity}</p>
              <p><strong>PIN:</strong> 201007 {labelData.customerPin}</p>
            </div>
            <div style={{ display: 'flex' }}>
            <div className="section" style={{ width: '16rem' }}>
                <p><strong>{labelData.paymentType}</strong></p>
                <p><strong>Product name</strong></p>
                <p>{labelData.productName}</p>
              </div>
              <div className="section" style={{ width: '10rem' }}>
                <p><strong>{labelData.paymentType}</strong></p>
                <p><strong>INR</strong></p>
                <p>{labelData.amount}</p>
              </div>
              <div className="section" style={{ width: '12rem' }}>
                <p><strong>Price Total</strong></p>
                <p>INR {labelData.amount}</p>
                <p>Surface</p>
              </div>
            </div>
            <div style={{ display: 'flex' }}>
              <div className="section" style={{ width: '12rem' }}>
                <p><strong>Product (QTY)</strong></p>
              </div>
              <div className="section" style={{ width: '12rem' }}>
                <p>box({labelData?.productDetail?.quantity})</p>
              </div>
            </div>
            <div style={{ display: 'flex' }}>
              <div className="section" style={{ width: '12rem' }}>
                <p><strong>Total INR</strong></p>
              </div>
              <div className="section" style={{ width: '12rem' }}>
                <p>{labelData.amount}</p>
              </div>
            </div>
            <div className="section">
              <p><strong>Return Address:</strong></p>
              <p>C 1001 bhavani heights, near dmart, sudama chawk Surat, Surat, Gujarat, India, 394101</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LabelGenerator;
