"use client";
import { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
    dialogContent: {
      maxHeight: 400, // Adjust the max height as needed
      overflowY: "auto",
    },
  }));

export default function Page({ params }) {
  var apartmentId = params.id;
  const [patrolData, setPatrolData] = useState([]);
  const [loading, setLoading] = useState(true);



  
  useEffect(() => {
    const dataRead = async () => {
        setLoading(true);
        var todayDateStart = new Date()
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
        console.log("Reports : ");
        console.log(reports);
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
      };
      dataRead();
  }, []);


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