import React from 'react';
import { Button } from 'antd';
import axios from 'axios';

const MasterMIS_Report = () => {
  const handleDownload = async () => {
    try {
      const response = await axios.get('/api/report/getmisreport', {
        responseType: 'blob', // Ensures the response is treated as a binary file
      });

      // Create a URL for the blob and initiate the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'orders_report.xlsx'); // The filename to be saved
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading the MIS report:', error);
      // Optionally, provide feedback to the user
    }
  };

  return (
    <div>
      <Button type='primary' onClick={handleDownload}>Download MIS Report</Button>
    </div>
  );
};

export default MasterMIS_Report;
