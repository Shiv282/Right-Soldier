"use client";
import React, { useEffect, useState } from "react";
import "../form.css";
import axios from "axios";

const GuardForm = () => {

    const [apartments, setApartments] = useState([]);

    useEffect(()=>{
        async function fetchData(){
            const response = await axios({
                method: 'GET',
                url: "http://localhost:3000/apartments",
              });
              console.log(response.data.data);
              setApartments(response.data.data);
        }
        fetchData();
    },[])

    const addGuard = async () =>{
        var guardName = document.getElementById('guardName').value;
        var apartmentId = document.getElementById('apartmentName').value;
        var salary = document.getElementById('salary').value;
        var phone = document.getElementById('phone').value;
        var apartmentName = document.getElementById('apartmentName').options[document.getElementById('apartmentName').selectedIndex].text;
        const currentDate = new Date();
        const date = currentDate.getDate();
        const month = currentDate.getMonth() + 1;  // JavaScript months are 0-based, so we add 1
        const year = currentDate.getFullYear();
        var timestamp = date+" - "+month+" - "+year;
        try{
            const response = await axios({
                method: 'POST',
                url: "http://localhost:8080/addGuard",
                data: {
                    name: guardName,
                    apartmentName: apartmentName,
                    apartmentId: apartmentId,
                    salary: salary,
                    dateOfJoining: timestamp,
                    phone: phone
                }
              });
              console.log(response);
              closeGuard();
        }catch (error) {
            console.error('Error:', error);
            if(error.response.status == 400){
                setDialogData("Guard already exists");
            }
            setError(error.message || 'An error occurred');
            document.getElementById('guardName').value = "";
          }
      }


  return (
    <div className="form-container_guard">
      <div className="form-header">
        <h2 className="form-title">Add Guard</h2>
      </div>
      <div className="form-body">
        <div className="form-field">
          <label htmlFor="guardName">Enter Name</label>
          <input type="text" name="guardName" id="guardName" />
        </div>
        <div className="form-field">
          <label className="mr-5" htmlFor="apartmentName">
            Choose apartment
          </label>
          <select className="w-full p-2 border border-[#ccc] text-base rounded-sm" name="apartmentName" id="apartmentName">
            {apartments.map((apartment) => (
              <option key={apartment._id} value={apartment._id}>
                {apartment.apartmentName}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label className="mr-5" htmlFor="salary">
            Enter salary
          </label>
          <input type="number" name="salary" id="salary" />
        </div>
        <div className="form-field">
          <label className="mr-5" htmlFor="phone">
            Enter phone number
          </label>
          <input type="number" name="phone" id="phone" />
        </div>
      </div>
      <div className="form-footer">
        <button className="btn" onClick={addGuard}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default GuardForm;
