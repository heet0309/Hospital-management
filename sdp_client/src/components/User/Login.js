import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { getUser } from "../../api/patient";

const Login = (props) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [userId, setUserId] = useState("");
  const [userDetails, setUserDetails] = useState({});
  let history = useHistory();

  const getUserDetail = async () => {
    if (userId !== "") {
      const data = await getUser(userId);
      setUserDetails(data.data);
      console.log(data.data);
      if (data.data.isAdmin === true) {
        history.push("/admin/Home");
      } else {
        history.push("/");
      }
    }
  };

  useEffect(() => {
    getUserDetail();
  }, [userId]);

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

    if (json.success) {
      // Save the auth token and redirect
      setUserId(json.data.user.id);
      localStorage.setItem("token", json.authToken);
      props.showAlert("Logged in successfully", "success");
      await getUserDetail();
    } else {
      props.showAlert("Invalid credentials", "danger");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="mt-3">
      <h1>Login to continue to Hospital Management</h1>
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

        <button
          type="submit"
          onClick={handleSubmit}
          className="btn btn-primary"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
