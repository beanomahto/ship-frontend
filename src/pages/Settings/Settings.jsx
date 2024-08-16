import React from 'react';
import { FaUser, FaPlug, FaTruck, FaWarehouse, FaSearch, FaFileInvoice, FaTag, FaCogs } from 'react-icons/fa'; 
import { Link } from 'react-router-dom';
import './Settings.css'; 

const data = [
  { heading: 'Account', icon: FaUser, links: [{ label: 'Profile', url: '/profile' }, { label: 'KYC', url: '/kyc' }, { label: 'POC Details', url: '/poc-details' }] },
  { heading: 'Integrations', icon: FaPlug, links: [{ label: 'Integration', url: '/integration' }, { label: '3rd Party Integration', url: '/3rd-party-integration' }] },
  { heading: 'Carrier', icon: FaTruck, links: [{ label: 'Manage Couriers', url: '/manage-couriers' }, { label: 'Manage Serviceable Pincodes', url: '/serviceable-pincodes' }, { label: 'Upload Tracking Number', url: '/upload-tracking-number' }] },
  { heading: 'Manage Warehouse', icon: FaWarehouse, links: [{ label: 'Manage Warehouse', url: '/manage-warehouse' }] },
  { heading: 'Order Lookup', icon: FaSearch, links: [{ label: 'Customize Track Order', url: '/customize-track-order' }] },
  { heading: 'Invoice', icon: FaFileInvoice, links: [{ label: 'Store Details', url: '/store-details' }, { label: 'General', url: '/invoice-general' }, { label: 'Advance', url: '/invoice-advance' }] },
  { heading: 'Label', icon: FaTag, links: [{ label: 'Manage Labels', url: '/manage-labels' }] },
  { heading: 'General', icon: FaCogs, links: [{ label: 'Add Package Box', url: '/add-package-box' }, { label: 'Pick List', url: '/pick-list' }] },
];

const Settings = () => {
  return (
    <div className="grid-container">
      {data.map((item, index) => {
        const Icon = item.icon; 
        return (
          <div key={index} className="grid-item">
            <div className="header">
              <div className="icon-container">
                <Icon size={24} />
              </div>
              <h3 className="heading">{item.heading}</h3>
            </div>
            <div className="links">
              {item.links.map((link, i) => (
                <Link key={i} to={link.url} className="link">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Settings;
