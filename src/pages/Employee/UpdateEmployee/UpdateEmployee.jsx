import { message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CreateEmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState({
    name: "",
    professionalEmail: "",
    password: "",
    contact: "",
    address: "",
    position: "",
    fatherName: "",
    emergencyContact: "",
    permanentEmail: "",
    dateOfJoining: "",
    employeeCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchEmployee = async () => {
        try {
          setLoading(true);
          const response = await axios.get(
            `process.env.url/api/employee/getEmployeeById/${id}`
          );
          setState(response.data);
          setLoading(false);
        } catch (err) {
          setError("Failed to fetch employee data.");
          setLoading(false);
        }
      };

      fetchEmployee();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await axios.put(
        `process.env.url/api/employee/updateEmployee/${id}`,
        state
      );
      message.success("Employee updated successfully!");
      navigate("/employee");
      setError(null);
    } catch (err) {
      message.error("Failed to update employee.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formCon">
      <form className="form" onSubmit={handleSubmit}>
        <p className="title">Create Employee</p>

        <div className="flex">
          <label>
            <input
              className="input"
              type="text"
              name="name"
              value={state.name}
              onChange={handleChange}
              required
            />
            <span>Name</span>
          </label>
          <label>
            <input
              className="input"
              type="email"
              name="professionalEmail"
              value={state.professionalEmail}
              onChange={handleChange}
              required
            />
            <span>Professional Email</span>
          </label>
          <label>
            <input
              className="input"
              type="password"
              name="password"
              value={state.password}
              onChange={handleChange}
              required
            />
            <span>Password</span>
          </label>
        </div>

        <div className="flex">
          <label>
            <input
              className="input"
              type="text"
              name="contact"
              value={state.contact}
              onChange={handleChange}
              required
            />
            <span>Contact</span>
          </label>
          <label>
            <input
              className="input"
              type="text"
              name="address"
              value={state.address}
              onChange={handleChange}
              required
            />
            <span>Address</span>
          </label>
          <label>
            <input
              className="input"
              type="text"
              name="position"
              value={state.position}
              onChange={handleChange}
              required
            />
            <span>Position</span>
          </label>
        </div>

        <div className="flex">
          <label>
            <input
              className="input"
              type="text"
              name="fatherName"
              value={state.fatherName}
              onChange={handleChange}
              required
            />
            <span>Father Name</span>
          </label>
          <label>
            <input
              className="input"
              type="text"
              name="emergencyContact"
              value={state.emergencyContact}
              onChange={handleChange}
              required
            />
            <span>Emergency Contact</span>
          </label>
          <label>
            <input
              className="input"
              type="text"
              name="permanentEmail"
              value={state.permanentEmail}
              onChange={handleChange}
              required
            />
            <span>Permanent Email</span>
          </label>
        </div>

        <div className="flex">
          <label>
            <input
              className="input"
              type="text"
              name="dateOfJoining"
              value={state.dateOfJoining}
              onChange={handleChange}
              required
            />
            <span>Date Of Joining</span>
          </label>
          <label>
            <input
              className="input"
              type="text"
              name="employeeCode"
              value={state.employeeCode}
              onChange={handleChange}
              required
            />
            <span>Employee Code</span>
          </label>
        </div>

        <button className="submit" type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
      </form>
    </div>
  );
};

export default CreateEmployeeForm;
