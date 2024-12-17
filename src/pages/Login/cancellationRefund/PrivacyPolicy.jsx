import React from 'react';
import './PrivacyPolicy.css';


const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-container">
      <h1 className="privacy-policy-title">Privacy Policy</h1>

      <div className="policy-section">
        <h2 className="section-title">Introduction</h2>
        <p className="section-description">
          Welcome to <strong>Shiphere</strong>. Your privacy is critically important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
        </p>
      </div>

      <div className="policy-section">
        <h2 className="section-title">Information We Collect</h2>
        <p className="section-description">
          We may collect personal information from you in various ways, including:
        </p>
        <ul className="section-list">
          <li><strong>Personal Data:</strong> Name, email address, phone number, shipping addresses, and payment information.</li>
          <li><strong>Usage Data:</strong> Information about how you use our website and services, including your IP address, browser type, access times, and pages visited.</li>
          <li><strong>Cookies and Tracking Technologies:</strong> We use cookies and similar tracking technologies to track activity on our service and hold certain information.</li>
        </ul>
      </div>

      <div className="policy-section">
        <h2 className="section-title">How We Use Your Information</h2>
        <p className="section-description">
          We use the information we collect in the following ways:
        </p>
        <ul className="section-list">
          <li><strong>To Provide Services:</strong> Process and manage your orders, shipping, and payments.</li>
          <li><strong>To Communicate:</strong> Send you updates, marketing communications, and respond to your inquiries.</li>
          <li><strong>To Improve Our Services:</strong> Analyze usage and improve our website, products, and services.</li>
          <li><strong>For Security:</strong> Protect against fraud and ensure the security of our services.</li>
        </ul>
      </div>

      <div className="policy-section">
        <h2 className="section-title">Disclosure of Your Information</h2>
        <p className="section-description">
          We may share your information with:
        </p>
        <ul className="section-list">
          <li><strong>Service Providers:</strong> Third-party companies that perform services on our behalf, such as payment processing and shipping.</li>
          <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred.</li>
          <li><strong>Legal Requirements:</strong> If required by law, to protect and defend our rights, or to protect the safety of our users.</li>
        </ul>
      </div>

      <div className="policy-section">
        <h2 className="section-title">Security of Your Information</h2>
        <p className="section-description">
          We use a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
        </p>
      </div>

      <div className="policy-section">
        <h2 className="section-title">Your Data Protection Rights</h2>
        <p className="section-description">
          Depending on your location, you may have the following rights regarding your personal data:
        </p>
        <ul className="section-list">
          <li><strong>Access:</strong> You can request access to the personal data we hold about you.</li>
          <li><strong>Correction:</strong> You can request that we correct any inaccurate or incomplete data.</li>
          <li><strong>Deletion:</strong> You can request that we delete your personal data, subject to certain exceptions.</li>
          <li><strong>Objection:</strong> You can object to the processing of your personal data in certain circumstances.</li>
          <li><strong>Data Portability:</strong> You can request that we transfer your personal data to another organization or to you.</li>
        </ul>
      </div>

      <div className="policy-section">
        <h2 className="section-title">Cookies</h2>
        <p className="section-description">
          Our website uses cookies to enhance user experience. You can set your browser to refuse all or some browser cookies, or to alert you when cookies are being sent. If you disable or refuse cookies, please note that some parts of our website may become inaccessible or not function properly.
        </p>
      </div>

      <div className="policy-section">
        <h2 className="section-title">Changes to This Privacy Policy</h2>
        <p className="section-description">
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. We encourage you to review this Privacy Policy periodically for any changes.
        </p>
      </div>

      <div className="policy-section">
        <h2 className="section-title">Contact Us</h2>
        <p className="section-description">
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <ul className="section-list">
          <li><strong>Shiphere</strong></li>
          <li><strong>Ashok vihar new Delhi</strong></li>
          <li><strong>support@shiphere.in</strong></li>
        </ul>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
