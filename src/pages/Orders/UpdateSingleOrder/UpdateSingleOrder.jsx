import React, { useState, useEffect } from "react";
import { Radio } from "antd";
import "../orders.css";
import useCreateSingleOrder from "../../../hooks/useCreateSingleOrder";
import useGetSingleOrderWithId from "../../../hooks/useGetSingleOrderWithId";
import useUpdateOrder from "../../../hooks/useUpdateOrder";
import pincodeData from "../../../utils/zones.json";
import { useNavigate, useParams } from "react-router-dom";

const UpdateSingleOrder = () => {
  const navigate = useNavigate();
  const { id, orderId } = useParams();
  console.log(orderId);
  const {
    loading: singleOrderLoading,
    order: singleOrder,
    getSingleOrderWithId,
  } = useGetSingleOrderWithId();
  const { loading: updateLoading, updateOrder } = useUpdateOrder();
  const [inputs, setInputs] = useState({
    _id: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    id: "",
    pincode: "",
    city: "",
    state: "",
    productPrice: "",
    productName: "",
    address: "",
    landMark: "",
    quantity: "",
    sku: "",
    weight: "",
    length: "",
    breadth: "",
    height: "",
    paymentMethod: null,
  });

  useEffect(() => {
    if (id) {
      getSingleOrderWithId(id);
    }
  }, [id]);

  console.log(singleOrder);
  useEffect(() => {
    if (singleOrder) {
      setInputs({
        _id: id,
        customerName: singleOrder?.order?.customerName,
        customerEmail: singleOrder?.order?.customerEmail,
        customerPhone: singleOrder?.order?.customerPhone,
        orderId: orderId,
        pincode: singleOrder?.order?.pincode,
        city: singleOrder?.order?.city,
        state: singleOrder?.order?.state,
        productPrice: singleOrder?.order?.productPrice,
        productName: singleOrder?.order?.productName,
        address: singleOrder?.order?.address,
        landMark: singleOrder?.order?.landMark,
        quantity: singleOrder?.order?.quantity,
        sku: singleOrder?.order?.sku,
        weight: singleOrder?.order?.weight,
        length: singleOrder?.order?.length,
        breadth: singleOrder?.order?.breadth,
        height: singleOrder?.order?.height,
        paymentMethod: singleOrder?.order?.paymentMethod,
      });
    }
  }, [singleOrder]);

  const handlePincodeChange = (e) => {
    const enteredPincode = e.target.value;
    setInputs({ ...inputs, pincode: enteredPincode });

    const matchedData = pincodeData.find(
      (item) => item.Pincode.toString() === enteredPincode
    );
    if (matchedData) {
      setInputs({
        ...inputs,
        pincode: enteredPincode,
        city: matchedData.City,
        state: matchedData.StateName,
      });
    } else {
      setInputs({
        ...inputs,
        pincode: enteredPincode,
        city: "",
        state: "",
      });
    }
  };
  console.log(inputs);

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    await updateOrder(inputs);
    navigate("/orders");
  };

  if (singleOrderLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="formCon">
      <form className="form" onSubmit={handleOrderSubmit}>
        <p className="title">Update Single Product</p>

        <div className="flex">
          <label>
            <input
              className="input"
              type="text"
              placeholder=""
              required
              value={inputs.customerName}
              onChange={(e) =>
                setInputs({ ...inputs, customerName: e.target.value })
              }
            />
            <span>Customer Name</span>
          </label>
          <label>
            <input
              className="input"
              type="number"
              placeholder=""
              required
              value={inputs.customerPhone}
              onChange={(e) =>
                setInputs({ ...inputs, customerPhone: e.target.value })
              }
            />
            <span>Customer Phone</span>
          </label>
          <label>
            <input
              className="input"
              type="email"
              placeholder=""
              required
              value={inputs.customerEmail}
              onChange={(e) =>
                setInputs({ ...inputs, customerEmail: e.target.value })
              }
            />
            <span>Customer Email</span>
          </label>
        </div>
        <div className="flex">
          <label>
            <input
              className="input"
              type="text"
              placeholder=""
              required
              value={inputs.address}
              onChange={(e) =>
                setInputs({ ...inputs, address: e.target.value })
              }
            />
            <span>Customer Full Address</span>
          </label>
          <label>
            <input
              className="input"
              type="text"
              placeholder=""
              required
              value={inputs.pincode}
              onChange={handlePincodeChange}
            />
            <span>Pin</span>
          </label>
          <label>
            <input
              className="input"
              type="text"
              placeholder=""
              value={inputs.landMark}
              onChange={(e) =>
                setInputs({ ...inputs, landMark: e.target.value })
              }
            />
            <span>Landmark</span>
          </label>
        </div>
        <div className="flex">
          <label>
            <input
              className="input"
              type="text"
              placeholder=""
              value={inputs.city}
            />
            <span>City</span>
          </label>

          <label>
            <input
              className="input"
              type="text"
              placeholder=""
              value={inputs.state}
            />
            <span>State</span>
          </label>
          <label>
            <input
              className="input"
              type="text"
              placeholder=""
              required
              value={inputs.productName}
              onChange={(e) =>
                setInputs({ ...inputs, productName: e.target.value })
              }
            />
            <span>Product name</span>
          </label>
        </div>
        <div className="flex">
          <label>
            <input
              className="input"
              type="number"
              placeholder=""
              required
              value={inputs.quantity}
              onChange={(e) =>
                setInputs({ ...inputs, quantity: e.target.value })
              }
            />
            <span>Quantity</span>
          </label>
          <label>
            <input
              className="input"
              type="number"
              placeholder=""
              required
              value={inputs.productPrice}
              onChange={(e) =>
                setInputs({ ...inputs, productPrice: e.target.value })
              }
            />
            <span>Product Price</span>
          </label>

          <label>
            <input
              className="input"
              type="text"
              placeholder=""
              required
              value={inputs.sku}
              onChange={(e) => setInputs({ ...inputs, sku: e.target.value })}
            />
            <span>SKU</span>
          </label>
        </div>
        <div className="flex">
          <label>
            <input
              className="input"
              type="text"
              placeholder=""
              value={inputs.orderId}
              onChange={(e) => setInputs({ ...inputs, id: e.target.value })}
            />
            <span>Order ID</span>
          </label>

          <label>
            <input
              className="input"
              type="number"
              placeholder=""
              required
              value={inputs.length}
              onChange={(e) => setInputs({ ...inputs, length: e.target.value })}
            />
            <span>Length</span>
          </label>

          <label>
            <input
              className="input"
              type="number"
              placeholder=""
              required
              value={inputs.breadth}
              onChange={(e) =>
                setInputs({ ...inputs, breadth: e.target.value })
              }
            />
            <span>Width</span>
          </label>
        </div>
        <div className="flex">
          <label>
            <input
              className="input"
              type="number"
              placeholder=""
              required
              value={inputs.height}
              onChange={(e) => setInputs({ ...inputs, height: e.target.value })}
            />
            <span>Height</span>
          </label>

          <label>
            <input
              className="input"
              type="number"
              placeholder=""
              required
              value={inputs.weight}
              onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
            />
            <span>Weight (g)</span>
          </label>

          <div className="paymentSelect" style={{}}>
            {/* <Select
              style={{ width: "18rem", height: "50px" }}
              placeholder="Select Payment Method"
              value={inputs.paymentMethod}
              onChange={(e) => setInputs({ ...inputs, paymentMethod: e })}
              options={[
                { value: "COD", label: "Cash on delivery" },
                { value: "prepaid", label: "Prepaid" },
              ]}
            >
            </Select> */}
            <Radio.Group
              style={{ marginTop: "20px" }}
              value={inputs.paymentMethod}
              onChange={(e) =>
                setInputs({ ...inputs, paymentMethod: e.target.value })
              }
            >
              <Radio value="prepaid">Prepaid</Radio>
              <Radio value="COD">Cash on delivery</Radio>
            </Radio.Group>
          </div>
        </div>
        <button className="submit">Submit</button>
      </form>
    </div>
  );
};

export default UpdateSingleOrder;
