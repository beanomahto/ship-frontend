import React from 'react';
import {Modal, Form, Input, Button, Checkbox } from 'antd';

const ChannelIntegrationModal = ({ visible, channel, onOk, onCancel }) => {
    const [form] = Form.useForm();

    const handleFormSubmit = () => {
      form.validateFields()
        .then(values => {
          console.log('Form Values:', values);
          onOk();
        })
        .catch(info => {
          console.log('Validate Failed:', info);
        });
    };
  
    return (
      <Modal 
        title={`Integrate ${channel}`} 
        visible={visible} 
        onOk={handleFormSubmit} 
        onCancel={onCancel}
        footer={[
          <Button key="back" onClick={onCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleFormSubmit}>
            Integrate
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          name="integrationForm"
        >
          <Form.Item
            name="storeName"
            label="Store Name"
            rules={[{ required: true, message: 'Please input your store name!' }]}
          >
            <Input placeholder="Enter store name" />
          </Form.Item>
          <Form.Item
            name="storeUrl"
            label="Store URL"
            rules={[{ required: true, message: 'Please input your store URL!' }]}
          >
            <Input placeholder="Enter store URL" />
          </Form.Item>
          <Form.Item
            name="apiKey"
            label="API Key"
            rules={[{ required: true, message: 'Please input your API key!' }]}
          >
            <Input placeholder="Enter API key" />
          </Form.Item>
          <Form.Item
            name="apiPassword"
            label="API Password"
            rules={[{ required: true, message: 'Please input your API password!' }]}
          >
            <Input.Password placeholder="Enter API password" />
          </Form.Item>
          <Form.Item
          name="terms"
          valuePropName="checked"
          rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject('You must accept the terms and conditions') }]}
        >
          <Checkbox>
            I have read and accept the <a href="#">terms and conditions</a>
          </Checkbox>
        </Form.Item>
        </Form>
      </Modal>
    );
  };
  
export default ChannelIntegrationModal;
