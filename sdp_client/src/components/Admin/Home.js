import React, { useEffect, useState } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";

const Home = () => {
  let location = useLocation();

  return (
    <div>
      <div className="d-flex ">
        <button type="button" class="btn btn-success me-3">
          <Link
            className={` nav-link ${location.pathname === "/" ? "active" : ""}`}
            aria-current="page"
            to="/admin/Home/PendingList"
          >
            <label className="text-decoration-none" style={{ color: "black" }}>
              Pending List
            </label>
          </Link>
        </button>
        <button type="button" class="btn btn-danger">
          <Link
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
            aria-current="page"
            to="/admin/Home/Approved"
          >
            <label className="text-decoration-none" style={{ color: "black" }}>
              Verified List
            </label>
          </Link>
        </button>
      </div>
    </div>
  );
};

export default Home;
