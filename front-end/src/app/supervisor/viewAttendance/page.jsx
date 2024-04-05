"use client";
import { useEffect, useState } from "react";
import axios from "axios";
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
      <div className="mx-20">
        <span>View Attendance</span>

        {pageData[0] ? (
          <div>
            {pageData.map((row) => (
              <div className="my-2" key={row._id}>
                <p> Guard : {row.name}</p>
                <p> Day Shift : 
                  {presentDate == row.lastPresentDay ? (
                    <span>Yes</span>
                  ) : (
                    <span>No</span>
                  )}
                </p>
                <p> Night Sift
                  {presentDate == row.lastPresentNight ? (
                    <span>Yes</span>
                  ) : (
                    <span>No</span>
                  )}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div>Loading</div>
        )}
      </div>
    </>
  );
}
