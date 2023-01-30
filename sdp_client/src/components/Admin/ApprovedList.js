import React, { useEffect, useState } from "react";
import { fetchApprovedList } from "../../api/hospital";

const ApprovedList = () => {
  const [hospitalData, setHospitalData] = useState([]);

  const handleApprovedList = async () => {
    const data = await fetchApprovedList();
    setHospitalData(data);
  };

  useEffect(() => {
    handleApprovedList();
  }, []);

  return (
    <div>
      <h1>Hospital Approved List</h1>
      <br></br>
      <div>
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">Hospital Name</th>
              <th scope="col">Email</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {hospitalData &&
              hospitalData.map((item) => (
                <tr>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.approved ? "Verified" : "Pending"}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApprovedList;
