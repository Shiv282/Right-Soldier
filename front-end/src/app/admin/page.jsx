"use client";
import { useEffect, useState } from "react";
import Loader from "@/components/loader";
import CancelIcon from '@mui/icons-material/Cancel';
import axios from "axios";

function getDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

export default function () {
  const [attendanceData, setAttendanceData] = useState([]);
  const [advanceRequests, setAdvanceRequests] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await axios({
        method: "GET",
        url: "http://localhost:8080/markedAttendance",
      });
      console.log(response.data);
      setAttendanceData(response.data);

      const result = await axios({
        method: "GET",
        url: "http://localhost:8080/advanceRequests",
      });
      console.log(result.data);
      setAdvanceRequests(result.data);

      const leaves = await axios({
        method: "GET",
        url: "http://localhost:8080/leaveRequests",
      });
      console.log(leaves.data);
      setLeaveRequests(leaves.data);

    }
    fetchData();
  }, []);

  return (
    <div>
      <div className="text-black bg-[#dfc6f7] text-center rounded-md shadow-xl p-2 flex justify-center items-center">
        {attendanceData[0] ? (
          <div className="w-full">
            <h1 className="text-3xl text-center font-extrabold underline underline-offset-8 mb-5">
              Today's Attendance
            </h1>
            <table className="w-full rounded-md bg-white table-auto border-collapse border-2 border-gray-300">
              <thead>
                <tr>
                  <th className="bg-gray-200 text-black p-4">Apartment Name</th>
                  <th className="bg-gray-200 text-black p-4">Shift Type</th>
                  <th className="bg-gray-200 text-black p-4">Count</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((attendance) => (
                  <tr key={attendance.apartmentName}>
                    <td className="border-b border-gray-300 p-4">
                      {attendance.apartmentName}
                    </td>
                    <td className="border-b border-gray-300 p-4">
                      {attendance.shiftType}
                    </td>
                    <td className="border-b border-gray-300 p-4">
                      {attendance.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            <Loader />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 col-span-3 my-5">
        <AdvanceRequest advanceRequests={advanceRequests} setAdvanceRequests={setAdvanceRequests}/>
        <LeaveRequest leaveRequests={leaveRequests} setLeaveRequests={setLeaveRequests}/>
      </div>
    </div>
  );
}

function AdvanceRequest({ advanceRequests, setAdvanceRequests }){
  return (
    <div className=" text-black bg-[#dfc6f7] text-center rounded-md mr-3 shadow-xl p-2">
          <div className="py-20 w-full">
            <h1 className="text-xl mb-10 text-center font-extrabold underline underline-offset-8">
              Advance Requests
            </h1>
            <table className="w-full rounded-md bg-white table-auto border-collapse border-2 border-gray-300">
              <thead>
                <tr>
                  <th className="bg-gray-200 text-black p-4">Guard Name</th>
                  <th className="bg-gray-200 text-black p-4">Reason</th>
                  <th className="bg-gray-200 text-black p-4">Amount</th>
                  <th className="bg-gray-200 text-black p-4">Close</th>
                </tr>
              </thead>
              <tbody>
                {advanceRequests[0] ? (
                  advanceRequests.map((advance,index) => (
                    <tr key={advance.guardId}>
                      <td className="border-b border-gray-300 p-4">
                        {advance.guardName}
                      </td>
                      <td className="border-b border-gray-300 p-4">
                        {advance.reason}
                      </td>
                      <td className="border-b border-gray-300 p-4">
                        {advance.amount}
                      </td>
                      <td className="border-b border-gray-300 p-4">
                        <CancelIcon onClick={async ()=>{
                          const response = await axios({
                            method: "DELETE",
                            url: "http://localhost:8080/deleteAdvance",
                            params:{
                              advanceRequestId: advance._id,
                              guardId: advance.guardId
                            }
                          });
                          console.log(response);
                          var cloneadvanceRequests = advanceRequests;
                          cloneadvanceRequests.splice(index,1);
                          setAdvanceRequests(cloneadvanceRequests);
                        }} className="hover:scale-125 transition duration-300 ease-in-out" />
                      </td>
                    </tr>
                  ))
                ) : (
                  <div>
                    <Loader />
                  </div>
                )}
              </tbody>
            </table>
          </div>
        </div>
  )
}


function LeaveRequest({ leaveRequests, setLeaveRequests }){
  return (
    <div className=" text-black bg-[#dfc6f7] text-center rounded-md mr-3 shadow-xl p-2">
          <div className="py-20 w-full">
            <h1 className="text-xl mb-10 text-center font-extrabold underline underline-offset-8">
              Leave Requests
            </h1>
            <table className="w-full rounded-md bg-white table-auto border-collapse border-2 border-gray-300">
              <thead>
                <tr>
                  <th className="bg-gray-200 text-black p-4">Guard Name</th>
                  <th className="bg-gray-200 text-black p-4">Reason</th>
                  <th className="bg-gray-200 text-black p-4">Date</th>
                  <th className="bg-gray-200 text-black p-4">Close</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests[0] ? (
                  leaveRequests.map((leave,index) => (
                    <tr key={leave.guardId}>
                      <td className="border-b border-gray-300 p-4">
                        {leave.guardName}
                      </td>
                      <td className="border-b border-gray-300 p-4">
                        {leave.reason}
                      </td>
                      <td className="border-b border-gray-300 p-4">
                        {getDate(leave.date)}
                      </td>
                      <td className="border-b border-gray-300 p-4">
                        <CancelIcon onClick={async ()=>{
                          const response = await axios({
                            method: "DELETE",
                            url: "http://localhost:8080/deleteLeave",
                            params:{
                              advanceRequestId: leave._id,
                              guardId: leave.guardId
                            }
                          });
                          console.log(response);
                          var cloneleaveRequests = leaveRequests;
                          cloneleaveRequests.splice(index,1);
                          setLeaveRequests(cloneleaveRequests);
                        }} className="hover:scale-125 transition duration-300 ease-in-out" />
                      </td>
                    </tr>
                  ))
                ) : (
                  <div>
                    <table>
                      <Loader/>
                    </table>
                  </div>
                )}
              </tbody>
            </table>
          </div>
        </div>
  )
}
