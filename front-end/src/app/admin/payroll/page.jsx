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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl text-center font-extrabold mb-3">
          Choose Apartment
        </h1>
        <div className=" bg-slate-200 p-3 shadow-xl" key={"data"}>
          <table className="w-full">
            <thead className="bg-black text-white">
              <tr>
                <th className="text-left px-3">Apartment</th>
                <th className="text-left">Location</th>
              </tr>
            </thead>
            <tbody>
              <>
                {data.map((apartment, index) => (
                  <tr className="hover:bg-slate-300">
                    <td>
                      <a
                        key={apartment._id}
                        href={`/admin/payroll/${apartment._id}`}
                      >
                        <div className="w-full p-1 px-2 m-1">
                        {apartment.apartmentName}
                        </div>
                      </a>
                    </td>
                    <td>
                      <a
                        key={apartment._id}
                        href={`/admin/payroll/${apartment._id}`}
                      >
                        <div className="w-full p-1 px-2">
                        {apartment.location}
                        </div>
                      </a>
                    </td>
                  </tr>
                ))}
              </>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
