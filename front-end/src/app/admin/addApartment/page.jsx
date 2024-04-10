"use client";
import React from "react";
import "../form.css";
import axios from "axios";

const ApartmentForm = () => {
  const addApartment = async () => {
    var location = document.getElementById("location").value;
    var apartmentName = document.getElementById("apartmentName").value;
    try {
      const response = await axios({
        method: "POST",
        url: "http://localhost:3000/addApartment",
        data: {
          location: location,
          apartmentName: apartmentName,
          supervisorName: "supervisorName",
          supervisorId: "66083795e85721253d79b143",
        },
      });
    } catch (error) {
      console.error("Error:", error);
      if (error.response.status == 400) {
        setDialogData("Apartment already exists");
      }
      setError(error.message || "An error occurred");
      document.getElementById("location").value = "";
      document.getElementById("apartmentName").value = "";
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2 className="form-title">Add Apartment</h2>
      </div>
      <div className="form-body">
        <div className="form-field">
          <label htmlFor="apartmentName">Apartment Name</label>
          <input type="text" name="apartmentName" id="apartmentName" />
        </div>
        <div className="form-field">
          <label htmlFor="location">Location</label>
          <input type="text" name="location" id="location" />
        </div>
      </div>
      <div className="form-footer">
        <button className="btn" onClick={addApartment}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default ApartmentForm;
