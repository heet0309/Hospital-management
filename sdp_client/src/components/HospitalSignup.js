import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const HospitalSignup = (props) => {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    mobileNo: "",
    licence: "",
    password: "",
  });
  const [selectedLicence, setSelectedLicence] = useState(null);
  let history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/auth/createuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: credentials.name,
        email: credentials.email,
        mobileNo: credentials.mobileNo,
        licence: credentials.licence,
        password: credentials.password,
      }),
    });
    const json = await response.json();
    console.log(json);

    if (json.success) {
      // Save the auth token and redirect
      localStorage.setItem("token", json.authToken);
      props.showAlert("Account Created successfully", "success");
      history.push("/");
    } else {
      props.showAlert("Invalid Details", "danger");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="mt-3">
      <h1>Create an account to use Hospital Bed Booking</h1>
      <form onSubmit={handleSubmit}>
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
          <label htmlFor="email" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            value={credentials.name}
            onChange={onChange}
            id="name"
            name="name"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="mobileNo" className="form-label">
            Contact No
          </label>
          <input
            type="text"
            className="form-control"
            value={credentials.mobileNo}
            onChange={onChange}
            id="mobileNo"
            name="mobileNo"
          />
        </div>
        {/* <div className="mb-3">
          <label htmlFor="licence" className="form-label">
            Licence
          </label>
          <input
            type="file"
            className="form-control"
            value={credentials.licence}
            onChange={onChange}
            id="licence"
            name="licence"
          />
        </div> */}
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
            required
            minLength={5}
            id="password"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            required
            onChange={onChange}
            minLength={5}
            name="cpassword"
            id="cpassword"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default HospitalSignup;
