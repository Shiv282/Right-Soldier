"use client"
import axios from "axios";
import { useState,useEffect } from "react";


export default function page() {
    const [data, setData] = useState([]);
  useEffect(() => {
    const dataRead = async () => {
      const response = await axios({
        method: "GET",
        url: "http://localhost:3000/apartments",
      });
      const rows = response.data.data;
      console.log(rows);
      setData(rows);
    };
    dataRead();
  }, []);

  return (
    <>
      <div>
        <h1>Attendance info</h1>
        {data.map((apartment) => (
            <div key={apartment._id}>
            <a
            key={apartment._id}
            href={"/admin/attendance/" + apartment._id}
            >
                {apartment.apartmentName}
            </a>
          </div>
          
        ))}
      </div>
    </>
  );
}
