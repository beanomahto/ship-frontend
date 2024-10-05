import React, { useState } from "react";
// import './RateCalculator.css'
import "./ratecalculatorr.css";
import { Select } from "antd";
import useRateCalculator from "../../hooks/useRateCalculator";
import Img from "../../utils/rateCal1.jpg";
import { Helmet } from "react-helmet";

const RateCalculator = () => {
  const { loading, rateCalculator } = useRateCalculator();
  const [inputs, setInputs] = useState({
    deliveryPartner: null,
    pickupPincode: "",
    deliveryPincode: "",
    weight: "",
    length: "",
    breadth: "",
    height: "",
    paymentMethod: null,
  });
  const [rateResult, setRateResult] = useState(null);

  console.log(inputs);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await rateCalculator(inputs);
    setRateResult(result);
  };

  return (
    <div style={{ display: "flex" }}>
        <Helmet>
                <meta charSet='utf-8' />
                <meta name='keyword' content={""} />
                <title>Rate Calculator</title>
            </Helmet>
      <div className="containerRC">
        <h1 className="form-title">Rate Calculator</h1>
        <form onSubmit={handleSubmit}>
          <div className="main-user-info">
            <div className="user-input-box" style={{ width: "42%" }}>
              <label htmlFor="fullName">Source Pin code</label>
              <input
                type="text"
                placeholder="Pick Pincode"
                value={inputs.pickupPincode}
                onChange={(e) =>
                  setInputs({ ...inputs, pickupPincode: e.target.value })
                }
              />
            </div>
            <div className="user-input-box" style={{ width: "42%" }}>
              <label htmlFor="username">Delivery Pincode</label>
              <input
                type="text"
                placeholder="Delivery Pincode"
                value={inputs.deliveryPincode}
                onChange={(e) =>
                  setInputs({ ...inputs, deliveryPincode: e.target.value })
                }
              />
            </div>

            <div className="user-input-box">
              <label>Length</label>
              <input
                type="number"
                placeholder="Enter Length"
                value={inputs.length}
                onChange={(e) =>
                  setInputs({ ...inputs, length: e.target.value })
                }
              />
            </div>
            <div className="user-input-box">
              <label htmlFor="phoneNumber">Breadth</label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Enter Breadth"
                value={inputs.breadth}
                onChange={(e) =>
                  setInputs({ ...inputs, breadth: e.target.value })
                }
              />
            </div>
            <div className="user-input-box">
              <label htmlFor="fullName">Height</label>
              <input
                type="number"
                placeholder="Enter Height"
                value={inputs.height}
                onChange={(e) =>
                  setInputs({ ...inputs, height: e.target.value })
                }
              />
            </div>
            <div className="user-input-box" style={{ width: "42%" }}>
              <label htmlFor="username">Weight</label>
              <input
                type="number"
                placeholder="Enter Weight"
                value={inputs.weight}
                onChange={(e) =>
                  setInputs({ ...inputs, weight: e.target.value })
                }
              />
            </div>
            <div className="user_input_cont">
              <div className="user-input-box">
                <label htmlFor="fullName">Source Courior Partner</label>
                <div className="dropdown">
                  <Select
                    className="selector"
                    placeholder="Select Courier Partner"
                    value={inputs.deliveryPartner}
                    onChange={(e) =>
                      setInputs({ ...inputs, deliveryPartner: e })
                    }
                    options={[
                      { value: "Ecom Express", label: "Ecom Express" },
                      { value: "Amazon Shipping", label: "Amazon Shipping" },
                      { value: "Xpressbees", label: "Xpressbees" },
                      { value: "Delhivery", label: "Delhivery" },
                      { value: "Blue Dart", label: "Blue Dart" },
                    ]}
                  />
                </div>
              </div>
              <div className="user-input-box">
                <label htmlFor="password">Payment Method</label>
                <Select
                  className="selector"
                  style={{ marginRight: "15rem" }}
                  placeholder="Select Payment Method"
                  value={inputs.paymentMethod}
                  onChange={(e) => setInputs({ ...inputs, paymentMethod: e })}
                  options={[
                    { value: "COD", label: "Cash on delivery" },
                    { value: "prepaid", label: "prepaid" },
                  ]}
                />
              </div>
            </div>
          </div>
          <div
            className="form-submit-btn"
            style={{ display: "flex", justifyContent: "center", gap: "1rem" }}
          >
            <button className="submit" type="submit">
              Submit
            </button>
            <h1>
              {loading
                ? "Calculating..."
                : rateResult
                  ? `Rate: ${rateResult.cost}`
                  : ""}
            </h1>
          </div>
        </form>
      </div>
      <div
        className="imgDiv"
      >
        <img src={Img} alt="Shipping" style={{ width: "100%" }} />
      </div>
    </div>
  );
};

export default RateCalculator;
