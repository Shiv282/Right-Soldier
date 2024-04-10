"use client";
import React, { useEffect, useState } from "react";
import "../form.css";
import axios from "axios";

const AddExistingGuard = () => {
  const [apartments, setApartments] = useState([]);
  const [guards, setGuards] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await axios({
        method: "GET",
        url: "http://localhost:3000/apartments",
      });
      console.log(response.data.data);
      setApartments(response.data.data);
      const guards = await axios({
        method: "GET",
        url: "http://localhost:3000/guards",
      });
      console.log(guards.data.data);
      setGuards(guards.data.data);
    }
    fetchData();
  }, []);

  const addExistingGuard = async () => {
    var apartmentId = document.getElementById("apartmentName").value;
    var guardId = document.getElementById("guardName").value;
    var guardName =
      document.getElementById("guardName").options[
        document.getElementById("guardName").selectedIndex
      ].text;
    const response = await axios({
      method: "POST",
      url: "http://localhost:3000/addExistingGuard",
      data: {
        guardId: guardId,
        guardName: guardName,
        apartmentId: apartmentId,
      },
    });
    console.log(response);
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2 className="form-title">Add Guard</h2>
      </div>
      <div className="form-body">
        <div className="form-field">
          <label className="mr-5" htmlFor="apartmentName">
            Choose apartment
          </label>
          <select
            className="w-full p-2 border border-[#ccc] text-base rounded-sm"
            name="apartmentName"
            id="apartmentName"
          >
            {apartments.map((apartment) => (
              <option key={apartment._id} value={apartment._id}>
                {apartment.apartmentName}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label className="mr-5" htmlFor="location">
            Choose Guard
          </label>
          <select
            className="w-full p-2 border border-[#ccc] text-base rounded-sm"
            name="guardName"
            id="guardName"
          >
            {guards.map((guard) => (
              <option key={guard._id} value={guard._id}>
                {guard.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-footer">
        <button className="btn" onClick={addExistingGuard}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default AddExistingGuard;
