"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "@/components/loader";
export default function ViewAttendancePage() {
  const [pageData, setPageData] = useState([]);
  const [presentDate, setPresentDate] = useState([]);

  useEffect(() => {
    async function fetchData() {
      var apartmentId = "66082468f79020f63b04bf0c";

      const response = await axios({
        method: "POST",
        url: "http://localhost:3000/apartment/guards",
        data: {
          id: apartmentId,
        },
      });
      const rows = response.data.data;
      console.log(rows);
      setPageData(rows);
      var presentDate = new Date().toDateString();
      setPresentDate(presentDate);
    }
    fetchData();
  },[]);

  return (
    <>
    <h1 className="text-3xl text-center font-extrabold mb-3">Today's Attendance</h1>
      <div className="mx-5 text-black bg-slate-200 p-3">
  <table className="w-full">
    <thead>
      <tr className="bg-black">
        <th className="text-left text-white">Guard</th>
        <th className="text-left text-white">Day Shift</th>
        <th className="text-left text-white">Night Shift</th>
      </tr>
    </thead>
    <tbody>
      {pageData[0] ? (
        pageData.map((row) => (
          <tr key={row._id}>
            <td>{row.name}</td>
            <td>
              {presentDate == row.lastPresentDay ? (
                <span>Yes</span>
              ) : (
                <span>No</span>
              )}
            </td>
            <td>
              {presentDate == row.lastPresentNight ? (
                <span>Yes</span>
              ) : (
                <span>No</span>
              )}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="3"><Loader /></td>
        </tr>
      )}
    </tbody>
  </table>
</div>
    </>
  );
}
