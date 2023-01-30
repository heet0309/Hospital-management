import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

const Hospital = (props) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  let history = useHistory();

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
    const json = await response.json();
    // console.log(json);

    if (json.success) {
      // Save the auth token and redirect
      localStorage.setItem("token", json.authToken);
      props.showAlert("Logged in successfully", "success");
      history.push("/");
    } else {
      props.showAlert("Invalid credentials", "danger");
    }
  };

  return (
    <div className="mt-3">
      <h1>Login to continue to Hospital Account</h1>
      <form className="mt-3">
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            value={credentials.email}
            onChange={onChange}
            id="email"
            name="email"
            aria-describedby="emailHelp"
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            value={credentials.password}
            onChange={onChange}
            name="password"
            id="password"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
      <Link to="/hospitalSignup">Regestration</Link>
    </div>
  );
};

export default Hospital;