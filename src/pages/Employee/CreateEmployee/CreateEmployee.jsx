import React from 'react';
import { useCreateEmployee } from './hooks/useCreateEmployee';

const CreateEmployeeForm = () => {
  const { state, handleChange, handleSubmit, loading, error, success } = useCreateEmployee();

  return (
    <div className='formCon'>
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
          {loading ? 'Submitting...' : 'Submit'}
        </button>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>Employee created successfully!</p>}
      </form>
    </div>
  );
};

export default CreateEmployeeForm;
