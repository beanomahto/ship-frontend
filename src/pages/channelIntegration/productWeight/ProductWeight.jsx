import React, { useState, useEffect } from "react";
import { Form, Input, Button, Table, Select, Space, Row, Col } from "antd";
import axios from "axios";

const ProductWeightForm = () => {
    const [allProducts, setAllProducts] = useState([]); // For table display
    const [newProducts, setNewProducts] = useState([]); // For payload submission
  
    const [formData, setFormData] = useState({ length: "", breadth: "", height: "", platform: "WooCommerce" });
  
    const [productName, setProductName] = useState("");
    const [weight, setWeight] = useState("");
    const [sku, setSku] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
  
    const fetchProducts = async () => {
      try {
        setFetching(true);
        const response = await axios.post(
          "https://backend.shiphere.in/api/orders/getproductdimensions",
          {},
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        setAllProducts(response.data.product || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setFetching(false);
      }
    };
  
    useEffect(() => {
      fetchProducts();
    }, []);
  
    const addProduct = () => {
      if (productName && weight && sku) {
        const newProduct = { productName, weight, sku };
        setAllProducts([...allProducts, newProduct]); // Add to table
        setNewProducts([...newProducts, newProduct]); // Add to payload
        setProductName("");
        setWeight("");
        setSku("");
      }
    };
  
    const handleSubmit = async () => {
      const totalWeight = newProducts.reduce((acc, product) => acc + Number(product.weight), 0);
  
      const payload = {
        productName: newProducts.map((product) => product.productName),
        length: formData.length,
        breadth: formData.breadth,
        height: formData.height,
        weight: totalWeight,
        platform: formData.platform,
      };
  
      console.log("Payload:", payload);
  
      try {
        setLoading(true);
        const response = await axios.post(
          "https://backend.shiphere.in/api/orders/addproductdimensions",
          payload,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        console.log(response.data);
  
        // Clear the new products array after submission
        setNewProducts([]);
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div style={{ padding: "20px" }}>
        <h3>Add Products</h3>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Space>
            <Input
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
            <Input
              placeholder="SKU"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
            />
            <Input
              placeholder="Weight"
              value={weight}
              type="number"
              onChange={(e) => setWeight(e.target.value)}
            />
            <Button onClick={addProduct}>Add</Button>
          </Space>
  
          <Table
  dataSource={allProducts}
  columns={[
    { title: "Product Name", dataIndex: "productName", key: "productName" },
    { title: "SKU", dataIndex: "sku", key: "sku" },
    { title: "Weight", dataIndex: "weight", key: "weight" },
    { title: "Length", dataIndex: "length", key: "length" }, // New column for Length
    { title: "Breadth", dataIndex: "breadth", key: "breadth" }, // New column for Breadth
    { title: "Height", dataIndex: "height", key: "height" }, // New column for Height
  ]}
  rowKey={(record) => record.sku}
  loading={fetching}
  pagination={false}
/>

  
          <Form layout="vertical" onFinish={handleSubmit}>
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item label="Length">
                  <Input
                    placeholder="Length"
                    value={formData.length}
                    onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Breadth">
                  <Input
                    placeholder="Breadth"
                    value={formData.breadth}
                    onChange={(e) => setFormData({ ...formData, breadth: e.target.value })}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Height">
                  <Input
                    placeholder="Height"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Platform">
                  <Select
                    value={formData.platform}
                    onChange={(value) => setFormData({ ...formData, platform: value })}
                  >
                    <Select.Option value="WooCommerce">WooCommerce</Select.Option>
                    <Select.Option value="Shopify">Shopify</Select.Option>
                    <Select.Option value="Amazon">Amazon</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
  
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </Form>
        </Space>
      </div>
    );
  };
  
  export default ProductWeightForm;
