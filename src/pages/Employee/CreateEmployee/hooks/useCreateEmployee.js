import { message } from "antd";
import axios from "axios";
import { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";

const initialState = {
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
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_FIELD_VALUE":
      return { ...state, [action.field]: action.value };
    case "RESET_FORM":
      return initialState;
    default:
      return state;
  }
};

export const useCreateEmployee = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: "SET_FIELD_VALUE", field: name, value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/employee/createEmployee`,
        state
      );
      setSuccess(true);
      dispatch({ type: "RESET_FORM" });
      message.success("Employee created successfully!");
      navigate("/employee");
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to create employee");
    } finally {
      setLoading(false);
    }
  };

  return { state, handleChange, handleSubmit, loading, error, success };
};
