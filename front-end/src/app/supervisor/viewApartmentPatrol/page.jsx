"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "@/components/loader";
import DateRangePicker from "@/components/DatePicker";

var apartmentId = "65e4700d1f2f37bb83d54a29";
var data = [];

export default function ViewPatrolHistory() {
  const [patrolData, setPatrolData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      var todayDateStart = new Date();
      todayDateStart.setDate(todayDateStart.getDate() - 100);
      var todayDateEnd = new Date();
      todayDateEnd.setDate(todayDateEnd.getDate() + 1);
      todayDateEnd.setHours(0, 0, 0, 0);
      const response = await axios({
        method: "POST",
        url: "http://localhost:3000/patrol/get",
        data: {
          apartmentId: apartmentId,
          startTime: todayDateStart,
          endTime: todayDateEnd,
        },
      });
      const reports = response.data;
      reports.sort((a, b) => a.time - b.time);
      const data = [];
      var temp = [];
      for (var i = 0; i < reports.length; i++) {
        if (reports[i].title == "Patrol started") {
          if (temp.length != 0) {
            data.push(temp);
          }
          temp = [];
        }
        temp.push(reports[i]);
      }
      setPatrolData(data);
      setLoading(false);
    }

    getData();
  }, []);

  if (loading) {
    return <Loader></Loader>;
  }

  return (
    <>
      <h1 className="text-3xl text-center font-extrabold mb-3">Patrol History</h1>
      <div></div>
      <div className=" bg-slate-200 p-3" key={"data"}>
        <table className="w-full">
          <thead className="bg-black text-white">
            <tr>
              <th className="text-left">Message</th>
              <th className="text-left">Date</th>
              <th className="text-left">Time</th>
            </tr>
          </thead>
          <tbody>
            {patrolData.map((row, index) => (
              <>
                {row.map((value) => (
                  <tr key={index}>
                    <td key={value._id}>{value.title}</td>
                    <td>
                      {new Date(value.time).getDate()}/
                      {new Date(value.time).getMonth()}
                    </td>
                    <td>
                      <span>
                        {new Date(value.time).getHours()}:
                        {new Date(value.time).getMinutes()}:
                        {new Date(value.time).getSeconds()} IST
                      </span>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
