"use client";
import React, { useState } from "react";
import "../form.css";
import axios from "axios";

const ApartmentForm = () => {
  const [contacts, setContacts] = useState([
    { name: "", contactNumber: "", designation: "" },
  ]);

  const handleChange = (e, index, field) => {
    const newContacts = [...contacts];
    newContacts[index][field] = e.target.value;
    setContacts(newContacts);
  };

  const addContact = () => {
    setContacts([
      ...contacts,
      { name: "", contactNumber: "", designation: "" },
    ]);
  };

  const removeContact = (indexToRemove) => {
    setContacts(contacts.filter((_, index) => index !== indexToRemove));
  };

  const addApartment = async () => {
    var location = document.getElementById("location").value;
    var apartmentName = document.getElementById("apartmentName").value;
    var manPower = document.getElementById("manPower").value;
    var SOP = document.getElementById("SOP").files[0];

    const formDataToSend = new FormData();
    formDataToSend.append('apartmentName', apartmentName);
    formDataToSend.append('location', location);
    formDataToSend.append('manPower', manPower);
    formDataToSend.append('SOP', SOP);
    formDataToSend.append('contacts', JSON.stringify(contacts));
    formDataToSend.append('supervisorName', 'supervisorName');
    formDataToSend.append('supervisorId', '66083795e85721253d79b143');

    try {
      const response = await axios.post('http://localhost:8080/addApartment', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error adding apartment:', error);
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
        <div className="form-field">
          <label htmlFor="manPower">Man Power Requirement</label>
          <input type="text" name="manPower" id="manPower" />
        </div>

        <div>
          <label htmlFor="contacts">Contacts</label>
          {contacts.map((contact, index) => (
            <div className="border p-2 mb-2 bg-gray-100">
              <div className="form-field" key={index}>
                <input
                  type="text"
                  id="contact_name"
                  name="contact_name"
                  value={contact.name}
                  placeholder="Name"
                onChange={(e) => handleChange(e, index, 'name')}
                  required
                />
              </div>
              <div className="form-field" key={index}>
                <input
                  type="text"
                  id="contact_number"
                  name="contact_number"
                  value={contact.contactNumber}
                  placeholder="Contact Number"
                  onChange={(e) => handleChange(e, index, 'contactNumber')}
                  required
                />
              </div>
              <div className="form-field" key={index}>
                <input
                  type="text"
                  id="contact_designation"
                  name="contact_designation"
                  placeholder="Designation"
                  value={contact.designation}
                  onChange={(e) => handleChange(e, index, 'designation')}
                  required
                />
              </div>
              <div className="form-field flex align-center justify-center" key={index}>
              <button className="bg-red-300 p-2 rounded-full" type="button" onClick={() => removeContact(index)}>
                X Remove
              </button>
              </div>
            </div>
          ))}
          <button
            className="bg-gray-200 wounded-md p-2"
            type="button"
            onClick={addContact}
          >
            + Add another contact info
          </button>
        </div>

        <div className="form-field">
          <label htmlFor="SOP">SOP file</label>
          <input type="file" name="SOP" id="SOP"/>
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
