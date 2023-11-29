import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    // confirmPassword: '',
  });

  const handleSubmit = (e) => {
    // event.preventDefault();
    // const { name, value } = e.target;
    // setValues({ ...values, [name]: value });
    axios.post('http://localhost:7001/register', values)
    .then(res => console.log(res))
    .then(err => console.log(err));
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Your Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            onChange={e => setValues({...values, name: e.target.value})}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Your Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            onChange={e => setValues({...values, email: e.target.value})}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            onChange={e => setValues({...values, password: e.target.value})}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            name="confirmPassword"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
