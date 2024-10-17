import { Divider } from 'antd';
import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <div>
      <Divider style={{ marginTop: '40px' }} />

      <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f0f2f5' }}>
        <p style={{ margin: 0 }}>Powered by <strong>ShipHere</strong></p>
        <div style={{ marginTop: '10px' }}>
          <a href="https://www.facebook.com/profile.php?id=61564399084185" target="_blank" rel="noopener noreferrer" style={{ margin: '0 10px' }}>
            <FaFacebookF size={20} />
          </a>
          <a href="https://twitter.com/shiphere" target="_blank" rel="noopener noreferrer" style={{ margin: '0 10px' }}>
            <FaTwitter size={20} />
          </a>
          <a href="https://www.linkedin.com/posts/transportix-solutions-technology-pvt-ltd_revolutionizing-delivery-join-the-future-activity-7248229151273299968-9Cld/?utm_source=share&utm_medium=member_desktop" target="_blank" rel="noopener noreferrer" style={{ margin: '0 10px' }}>
            <FaLinkedinIn size={20} />
          </a>  
          <a href="https://www.instagram.com/ship_here_/?igsh=MWxmZzgzbTNzcHk0dA%3D%3D" target="_blank" rel="noopener noreferrer" style={{ margin: '0 10px' }}>
            <FaInstagram size={20} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
