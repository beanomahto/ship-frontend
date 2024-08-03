import React from 'react';
import { Button } from 'antd';
import axios from 'axios';

const MasterMIS_Report = () => {
  const handleDownload = async () => {
    try {
      const response = await axios.get('/api/report/getmisreport', {
        responseType: 'blob', 
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'orders_report.xlsx'); 
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading the MIS report:', error);
    
    }
  };

  return (
    <div className="reportmaincontainer">
    <div className="reports-container">
      <h1>Reports</h1>
      <Button type='primary' onClick={handleDownload}>Download MIS Report</Button>
    </div>
    <div className="ndr-container">
      <h1>NDR Reports</h1>
    </div>
  </div>
  
  );
};

export default MasterMIS_Report;
