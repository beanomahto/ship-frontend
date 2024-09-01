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
  console.log(labelData);
  console.log(id);
  const generateLabel = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://backend.shiphere.in/api/shipping/getlabel/${id}`, {
        headers: {
          Authorization:`${token}`,
        }
      });
      const logoBase64 = await getBase64ImageFromUrl(response.data.logoUrl);
      setLabelData(response.data);
      setBase64Logo(logoBase64);
      setIsModalVisible(true);
      console.log(response);
      console.log(logoBase64);
      
    } catch (error) {
      console.error('Error generating label:', error.message);
      alert('Error generating label');
    }
  };
  useEffect(() => {
    generateLabel();
  }, []);

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
            <p><strong>Order Id:-</strong>{labelData.orderId}</p>
            <div style={labelData.logoUrl ? { display: 'flex' } : {}}>
              <div className="labelSection">
                <img style={{ width: '11rem' }} src={`data:image/png;base64,${labelData.barcode}`} alt="Barcode" />
                <p><>{labelData.shippingPartner}</></p>
                {/* <img style={{ width: '10rem' }} src={base64Logo} alt="" /> */}
              </div>
              {labelData.logoUrl &&
                <div className="labelSection" style={{ Width: '12rem' }} >
                  <img style={{ width: '9rem' }} src={base64Logo} alt="" />
                </div>
              }
            </div>
            <div className="labelSection">
              <p><strong>Ship To:</strong><p><strong>{labelData.customerName}</strong></p>{labelData?.returnWarehouse?.address} {labelData?.returnWarehouse?.state} {labelData?.returnWarehouse?.city}  {labelData?.returnWarehouse?.country} </p>
              {/* <p>{labelData.customerName}</p> */}
              {/* <p>{labelData.customerAddress}</p> */}
              {/* <p>{labelData.customerCity}</p> */}
              <p><strong>PIN:</strong> 201007 {labelData.customerPin}</p>
            </div>
            <div style={{ display: 'flex' }}>
              <div className="labelSection" style={{ width: '16rem' }}>
                <p><strong>{labelData.paymentType}</strong></p>
                <p><strong>Product name</strong></p>
                <p>{labelData.productName}</p>
              </div>
              <div className="labelSection" style={{ width: '10rem' }}>
                <p><strong>{labelData.paymentType}</strong></p>
                <p><strong>INR</strong></p>
                <p>{labelData.amount}</p>
              </div>
              <div className="labelSection" style={{ width: '12rem' }}>
                <p><strong>Price Total</strong></p>
                <p>INR {labelData.amount}</p>
                <p>Surface</p>
              </div>
            </div>
            <div style={{ display: 'flex' }}>
              <div className="labelSection" style={{ width: '12rem' }}>
                <p><strong>Product (QTY)</strong></p>
              </div>
              <div className="labelSection" style={{ width: '12rem' }}>
                <p>box({labelData?.productDetail?.quantity})</p>
              </div>
            </div>
            <div style={{ display: 'flex' }}>
              <div className="labelSection" style={{ width: '12rem' }}>
                <p><strong>Total INR</strong></p>
              </div>
              <div className="labelSection" style={{ width: '12rem' }}>
                <p>{labelData.amount}</p>
              </div>
            </div>
            <div className="labelSection">
              <p><strong>Return Address:</strong></p>
              <p>{labelData?.pickupAddress
?.address} {labelData?.pickupAddress
?.state} {labelData?.pickupAddress
?.city}  {labelData?.pickupAddress
?.country} </p>
            </div>
              <p>Powered by <strong>ShipHere</strong></p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LabelGenerator;