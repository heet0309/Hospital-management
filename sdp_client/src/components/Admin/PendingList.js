import React, { useEffect, useState } from "react";
import {
  deleteHospital,
  fetchPendingList,
  updateStatus,
} from "../../api/hospital";

const PendingList = () => {
  const [hospitalData, setHospitalData] = useState([]);

  const handlePendingList = async () => {
    const data = await fetchPendingList();
    setHospitalData(data);
  };

  const handelVerifiedStatus = async (hospitalId) => {
    const data = await updateStatus(hospitalId);
    alert("Hospital Verified successfully");
    handlePendingList();
  };

  const handelDeniedStatus = async (hospitalId) => {
    const data = await deleteHospital(hospitalId);
    alert(data.Success);
    handlePendingList();
  };

  useEffect(() => {
    handlePendingList();
  }, []);

  return (
    <div>
      <h1>Hospital Pending List</h1>
      <br></br>
      <div>
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">Hospital Name</th>
              <th scope="col">Email</th>
              <th scope="col">Status</th>
              <th scope="col">Aprroval</th>
            </tr>
          </thead>
          <tbody>
            {hospitalData &&
              hospitalData.map((item) => (
                <tr>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.approved ? "Verified" : "Pending"}</td>
                  <td>
                    <div className="d-flex ">
                      <button
                        type="button"
                        class="btn btn-success me-3"
                        onClick={() => {
                          handelVerifiedStatus(item._id);
                        }}
                      >
                        Allow
                      </button>
                      <button
                        type="button"
                        class="btn btn-danger"
                        onClick={() => {
                          handelDeniedStatus(item._id);
                        }}
                      >
                        Deny
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingList;
