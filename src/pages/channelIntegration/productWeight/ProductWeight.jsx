import {
  Button,
  Col,
  Form,
  Input,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  message,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";

const ProductWeightForm = () => {
  const [allProducts, setAllProducts] = useState([]); // For table display
  const [newProducts, setNewProducts] = useState([]); // For payload submission
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    length: "",
    breadth: "",
    height: "",
    platform: "WooCommerce",
  });

  const [productName, setProductName] = useState("");
  const [weight, setWeight] = useState("");
  const [sku, setSku] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const fetchProducts = async () => {
    try {
      setFetching(true);
      const response = await axios.post(
        `${process.env.url}/api/orders/getproductdimensions`,
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
  const handleDelete = async (productName) => {
    try {
      const response = await axios.post(
        `${process.env.url}/api/orders/deleteproductdimensions`,
        { productName },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (response.data.success) {
        message.success("Product deleted successfully");
        // Remove the product from state
        setAllProducts(
          allProducts.filter((product) => product.productName !== productName)
        );
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      message.error("Failed to delete product");
    }
  };
  const handleEdit = (product) => {
    setEditingProduct(product); // Track the product being edited
    setProductName(product.productName); // Set the productName in state
    setWeight(product.weight); // Set the weight in state
    setSku(product.sku); // Set the SKU in state
    setFormData({
      length: product.length || "",
      breadth: product.breadth || "",
      height: product.height || "",
      platform: product.platform || "WooCommerce",
    });
  };

  const addProduct = () => {
    if (editingProduct) {
      // Update the existing product
      const updatedProduct = { productName, weight, sku, ...formData };
      const updatedProducts = allProducts.map((product) =>
        product.productName === editingProduct.productName
          ? { ...product, ...updatedProduct }
          : product
      );
      setAllProducts(updatedProducts); // Update the state with updated products
      setNewProducts([
        // If you're sending payload data
        ...newProducts,
        updatedProduct,
      ]);
      setEditingProduct(null); // Reset editing mode
    } else {
      // Adding a new product
      if (productName && weight && sku) {
        const newProduct = { productName, weight, sku, ...formData };
        setAllProducts([...allProducts, newProduct]);
        setNewProducts([...newProducts, newProduct]);
      }
    }
    resetForm();
  };
  const resetForm = () => {
    setProductName("");
    setWeight("");
    setSku("");
    setFormData({
      length: "",
      breadth: "",
      height: "",
      platform: "WooCommerce",
    });
    setEditingProduct(null);
  };

  const handleSubmit = async () => {
    const totalWeight = newProducts.reduce(
      (acc, product) => acc + Number(product.weight),
      0
    );

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
        `${process.env.url}/api/orders/addproductdimensions`,
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
      fetchProducts();
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };
  const sharedInputStyles = {
    borderRadius: "8px",
    padding: "8px 12px",
    fontSize: "15px",
    boxShadow: "inset 0 1px 0px rgba(0, 0, 0, 0.1)",
    width: "100%",
  };
  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    { title: "SKU", dataIndex: "sku", key: "sku" },
    { title: "Weight", dataIndex: "weight", key: "weight" },
    { title: "Length", dataIndex: "length", key: "length" },
    { title: "Breadth", dataIndex: "breadth", key: "breadth" },
    { title: "Height", dataIndex: "height", key: "height" },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => handleEdit(record)} // Placeholder for edit functionality
          >
            <FaRegEdit size={20} />
          </Button>
          <Popconfirm
            title="Are you sure to delete this product?"
            onConfirm={() => handleDelete(record.productName)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              <RiDeleteBinLine size={20} />
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "10px" }}>
      <Row gutter={16}>
        {/* Left Section: Table */}
        <Col span={17}>
          <Table
            dataSource={allProducts}
            columns={columns}
            rowKey={(record) => record.sku}
            loading={fetching}
            pagination={false}
          />
        </Col>

        {/* Right Section: Form Box with Add Products Section */}
        <Col span={6}>
          <div
            style={{
              background: "white",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
              borderRadius: "12px",
              padding: "20px",
              width: "100%",
              maxWidth: "400px",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h4
              style={{
                marginBottom: "20px",
                fontSize: "20px",
                color: "#007bff",
                fontWeight: "500",
              }}
            >
              Add Products
            </h4>
            {/* Add Product Section */}
            <Space
              direction="vertical"
              style={{ width: "100%", marginBottom: "20px" }}
            >
              <Input
                placeholder="Product Name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                style={sharedInputStyles}
              />
              <Input
                placeholder="SKU"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                style={sharedInputStyles}
              />
              <Input
                placeholder="Weight"
                value={weight}
                type="number"
                onChange={(e) => setWeight(e.target.value)}
                style={sharedInputStyles}
              />
              <Button
                onClick={addProduct}
                style={{
                  background: "#007bff",
                  color: "#fff",
                  borderRadius: "8px",
                  padding: "10px",
                  fontWeight: "bold",
                  width: "100%",
                  transition: "background 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#0056b3")}
                onMouseLeave={(e) => (e.target.style.background = "#007bff")}
              >
                {editingProduct ? "Update Product" : "Add Product"}
              </Button>
            </Space>

            {/* Product Details Form */}
            <h4
              style={{
                marginBottom: "20px",
                fontSize: "20px",
                color: "#007bff",
                fontWeight: "500",
              }}
            >
              Product Details
            </h4>
            <Form
              layout="vertical"
              onFinish={handleSubmit}
              style={{ width: "100%" }}
            >
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item style={{ marginBottom: "16px" }}>
                    <Input
                      placeholder="Enter Length"
                      value={formData.length}
                      onChange={(e) =>
                        setFormData({ ...formData, length: e.target.value })
                      }
                      style={sharedInputStyles}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item style={{ marginBottom: "16px" }}>
                    <Input
                      placeholder="Enter Breadth"
                      value={formData.breadth}
                      onChange={(e) =>
                        setFormData({ ...formData, breadth: e.target.value })
                      }
                      style={sharedInputStyles}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item style={{ marginBottom: "16px" }}>
                    <Input
                      placeholder="Enter Height"
                      value={formData.height}
                      onChange={(e) =>
                        setFormData({ ...formData, height: e.target.value })
                      }
                      style={sharedInputStyles}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item style={{ marginBottom: "16px" }}>
                    <Select
                      value={formData.platform}
                      onChange={(value) =>
                        setFormData({ ...formData, platform: value })
                      }
                      style={{
                        ...sharedInputStyles,
                        padding: "0px",
                      }}
                    >
                      <Select.Option value="WooCommerce">
                        WooCommerce
                      </Select.Option>
                      <Select.Option value="Shopify">Shopify</Select.Option>
                      <Select.Option value="Amazon">Amazon</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{
                  background: "#007bff",
                  borderRadius: "8px",
                  padding: "10px 20px",
                  color: "#fff",
                  fontWeight: "bold",
                  width: "100%",
                  transition: "background 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#0056b3")}
                onMouseLeave={(e) => (e.target.style.background = "#007bff")}
              >
                {editingProduct ? "Update Details" : "Submit"}
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ProductWeightForm;
