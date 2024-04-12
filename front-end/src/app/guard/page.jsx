"use client";
import { useEffect, useState } from "react";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import {
  useStyles,
  updateAdvanceHistoryPopUp,
  fetchData,
  getDate,
  updateDutyData,
  daysInCurrentMonth,
  requestLeave,
  requestAdvance
} from "./utility";
import DayNightBarGraph from "../../components/DayNightBarGraph";
import SalaryPieChart from "../../components/SalaryPieChart";
import LineChart from "../../components/AdvanceHistoryLineChart";
import StreakCalculator from "../../components/streakData";
import Loader from "../../components/loader";
import axios from "axios";

export default function Home() {
  const [userData, setUserData] = useState([]);
  const [guardId, setGuardId] = useState("");
  const [guardName, setGuardName] = useState("");
  const [apartmentId, setApartmentId] = useState("");
  const [advanceDates, setAdvanceDates] = useState([]);
  const [advanceAmounts, setAdvanceAmounts] = useState([]);
  const [dutyDates, setDutyDates] = useState([]);
  const classes = useStyles();
  const [openAdvanceHistory, setOpenAdvanceHistory] = useState(false);
  const [advanceData, setAdvanceData] = useState([]);

  const [openDutyHistory, setOpenDutyHistory] = useState(false);
  const [dutyData, setDutyData] = useState([]);

  const handleOpenAdvanceHistory = async () => {
    setOpenAdvanceHistory(true);
  };
  const handleCloseAdvanceHistory = () => {
    setOpenAdvanceHistory(false);
  };

  const handleOpenDutyHistory = async () => {
    setOpenDutyHistory(true);
  };
  const handleCloseDutyHistory = () => {
    setOpenDutyHistory(false);
  };

  useEffect(() => {
    async function data() {
      const advanceDates = [];
      const advanceAmounts = [];
      const dutyDates = [];
      var id = localStorage.getItem("guardId");
      setGuardId(id);
      var userData = await fetchData(id);
      setUserData(userData);
      setApartmentId(userData[0].apartmentId);
      setGuardName(userData[0].name);
      var dutyData = await updateDutyData(id);
      setDutyData(dutyData);
      console.log("dutyData", dutyData);
      var advanceData = await updateAdvanceHistoryPopUp(userData);
      setAdvanceData(advanceData);
      console.log("advanceData", advanceData);

      advanceData.map((advance) => {
        advanceDates.push(getDate(advance[0].date));
        advanceAmounts.push(advance[0].amount);
      });

      dutyData.map((duty) => {
        dutyDates.push(getDate(duty.date));
      });
      console.log("advanceAmounts", advanceAmounts);
      console.log("advanceDates", advanceDates);
      setAdvanceAmounts(advanceAmounts);
      setAdvanceDates(advanceDates);
      setDutyDates(dutyDates);
    }
    data();
  }, []);

  return (
    <main>
      <div className="grid grid-rows-1 grid-cols-3 gap-1">
        <div className="row-span-1 min-h-full p-5 rounded-xl">
          <div className=" text-black bg-[#dfc6f7] min-h-full text-center rounded-md shadow-xl p-2 flex justify-center items-center">
            {userData[0] ? (
              <ProfileCard />
            ) : (
              <div>
                <Loader />
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 col-span-2">
          <div className="row-span-1 p-5 rounded-xl">
            <div className=" text-black  bg-[#dfc6f7] min-h-full text-center rounded-md shadow-xl py-8 px-6">
              <h1 className="text-xl text-center font-extrabold underline underline-offset-8">
                Day shifts vs Night shifts
              </h1>
              <div className="py-20" style={{ height: "90%", width: "90%" }}>
                {userData[0] ? (
                  <DayNightBarGraph
                    className="min-h-full"
                    yesCount={userData[0].days}
                    noCount={userData[0].nights}
                  />
                ) : (
                  <div>
                    <Loader />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="row-span-1 p-5 rounded-xl">
            <div className=" text-black bg-[#dfc6f7] text-center rounded-md shadow-xl p-6">
              <h1 className="text-xl text-center font-extrabold underline underline-offset-8">
                Salary breakup
              </h1>
              <div className="py-10" style={{ height: "100%", width: "100%" }}>
                {userData[0] ? (
                  <SalaryPieChart
                    totalSalary={
                      userData[0].salary -
                      userData[0].salary *
                        ((userData[0].days + userData[0].nights) /
                          daysInCurrentMonth)
                    }
                    salaryEarned={
                      userData[0].salary *
                      ((userData[0].days + userData[0].nights) /
                        daysInCurrentMonth)
                    }
                    advanceTaken={userData[0].advance}
                  />
                ) : (
                  <div>
                    <Loader />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-rows-2 grid-cols-3 gap-1">
        <div className="grid grid-cols-2 col-span-3 mb-5">
          <div className=" text-black bg-[#dfc6f7] text-center rounded-md mr-3 shadow-xl p-2">
            <div className="py-20" style={{ height: "90%", width: "90%" }}>
              <h1 className="text-xl mb-10 text-center font-extrabold underline underline-offset-8">
                Advance pattern
              </h1>
              {advanceDates[0] ? (
                <LineChart
                  className="min-h-full"
                  advanceAmounts={advanceAmounts}
                  advanceDates={advanceDates}
                />
              ) : (
                <div>
                  <Loader />
                </div>
              )}
            </div>
          </div>
          <div className="text-black bg-[#dfc6f7] text-center rounded-md shadow-xl p-2 flex justify-center items-center">
            {advanceDates[0] ? (
              <AdvanceHistory className="min-h-full" />
            ) : (
              <div>
                <Loader />
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 col-span-3">
          <div className=" text-black bg-[#dfc6f7] text-center rounded-md mr-3 shadow-xl p-2">
            <div className="py-20" style={{ height: "90%", width: "90%" }}>
              <h1 className="text-xl mb-10 text-center font-extrabold underline underline-offset-8">
                Duty Streak
              </h1>
              {dutyDates[0] ? (
                <StreakCalculator
                  className="min-h-full"
                  attendanceDates={dutyDates}
                />
              ) : (
                <div>
                  <Loader />
                </div>
              )}
            </div>
          </div>
          <div className="text-black bg-[#dfc6f7] text-center rounded-md shadow-xl p-2 flex justify-center items-center">
            {dutyDates[0] ? (
              <DutyHistory className="min-h-full" />
            ) : (
              <div>
                <Loader />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );

  function ProfileCard() {
    const [open,setOpen] = useState(false);
    const [leaveStatus, setLeaveStatus] = useState('');
    const [leaveId, setLeaveId] = useState('');

    const [openAdvance, setOpenAdvance] = useState(false);
    const [advanceStatus, setAdvanceStatus] = useState('');
    const [advanceRequestId, setAdvanceRequestId] = useState('');

    useEffect(()=>{
      if(userData[0] && userData[0].leave && userData[0].leave.leaveId){
        setLeaveId(userData[0].leave.leaveId);
        setLeaveStatus('Cancel Request');
      }else{
        setLeaveStatus('Request Leave');
      }
      
      if(userData[0] && userData[0].advanceRequest && userData[0].advanceRequest.advanceRequestId){
        setAdvanceRequestId(userData[0].advanceRequest.advanceRequestId);
        setAdvanceStatus('Cancel Request');
      }else{
        setAdvanceStatus('Request Advance');
      }
    },[])

    function handleRequestLeave(){
      setOpen(true);
    };

    function handleRequestAdvance(){
      setOpenAdvance(true);
    };

    async function cancelRequestLeave(){
      const response = await axios({
        method: "DELETE",
        url: "http://localhost:8080/deleteLeave",
        params:{
          leaveId: leaveId,
          guardId: guardId
        }
      });
      console.log(response);
      setLeaveStatus('Request Leave');
    }

    async function cancelRequestAdvance(){
      const response = await axios({
        method: "DELETE",
        url: "http://localhost:8080/deleteAdvance",
        params:{
          advanceRequestId: advanceRequestId,
          guardId: guardId
        }
      });
      console.log(response);
      setAdvanceStatus('Request Advance');
    }

    function handleClose(){
      setOpen(false);
    }

    function AdvanceDialogClose(){
      setOpenAdvance(false);
    }
    return (
      <div className="w-full">
        <div className="text-center">
          <h1 className="text-3xl text-center font-extrabold">Profile</h1>
        </div>

        <table className="bg-white w-full rounded-md my-3 table-auto border-collapse border-2 border-gray-300">
          <thead>
            <tr>
              <th className="bg-gray-200 text-black p-1">Field</th>
              <th className="bg-gray-200 text-black p-1">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-b text-left border-gray-100 p-1">Name</td>
              <td className="border-b text-left border-gray-100 p-1">
                {userData[0].name}
              </td>
            </tr>
            <tr>
              <td className="border-b text-left border-gray-100 p-1">
                Apartment Name
              </td>
              <td className="border-b text-left border-gray-100 p-1">
                {userData[0].apartmentName}
              </td>
            </tr>
            <tr>
              <td className="border-b text-left border-gray-100 p-1">Salary</td>
              <td className="border-b text-left border-gray-100 p-1">
                {userData[0].salary}
              </td>
            </tr>
            <tr>
              <td className="border-b text-left border-gray-100 p-1">Advance</td>
              <td className="border-b text-left border-gray-100 p-1">
                {userData[0].advance}
              </td>
            </tr>
            <tr>
              <td className="border-b text-left border-gray-100 p-1">Days</td>
              <td className="border-b text-left border-gray-100 p-1">
                {userData[0].days}
              </td>
            </tr>
            <tr>
              <td className="border-b text-left border-gray-100 p-1">Nights</td>
              <td className="border-b text-left border-gray-100 p-1">
                {userData[0].nights}
              </td>
            </tr>
            <tr>
              <td className="border-b text-left border-gray-100 p-1">
                Date of Joining
              </td>
              <td className="border-b text-left border-gray-100 p-1">
                {userData[0].dateOfJoining}
              </td>
            </tr>
            <tr>
              <td className="border-b text-left border-gray-100 p-1">Contact</td>
              <td className="border-b text-left border-gray-100 p-1">
                {userData[0].phone}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-center mt-5">
          <button onClick={(leaveStatus=="Request Leave")?handleRequestLeave:cancelRequestLeave} className="bg-blue-500 text-white px-3 py-2 rounded mr-2 hover:bg-blue-700">
            {leaveStatus}
          </button>
          <button onClick={(advanceStatus=="Request Advance")?handleRequestAdvance:cancelRequestAdvance} className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-700">
            {advanceStatus}
          </button>
        </div>


        <Dialog open={openAdvance} onClose={AdvanceDialogClose} scroll="paper">
          <DialogTitle>
            Request Advance
          </DialogTitle>
          <DialogContent dividers className={classes.dialogContent}>
          <div>
            <label htmlFor="amount">Amount</label>
            <input type="number" name="amount" id="amount" />
            </div>
            <div>
            <label htmlFor="advanceReason">Reason</label>
            <input type="text" name="advanceReason" id="advanceReason" />
            </div>
            <Button
              color="success"
              onClick={()=>{
                var amount = document.querySelector('#amount').value;
                var reason = document.querySelector('#advanceReason').value;
                var advanceRequestId = requestAdvance(guardId,amount,reason,apartmentId,guardName);
                setAdvanceRequestId(advanceRequestId);
                setOpenAdvance(false);
                setAdvanceStatus('Cancel Request');
              }}
              style={{ marginTop: 10 + "px" }}
              variant="contained"
            >
              Submit
            </Button>
          </DialogContent>
        </Dialog>


        <Dialog open={open} onClose={handleClose} scroll="paper">
          <DialogTitle>
            Choose date
          </DialogTitle>
          <DialogContent dividers className={classes.dialogContent}>
            <div>
            <label htmlFor="date">Date</label>
            <input type="date" name="date" id="date" />
            </div>

            <div>
            <label htmlFor="reason">Enter reason</label>
          <input type="text" name="reason" id="reason" />
            </div>
            <Button
              color="success"
              onClick={()=>{
                var date = document.querySelector('#date').value;
                var reason = document.querySelector('#reason').value;
                var leaveId = requestLeave(guardId,date,reason,apartmentId,guardName);
                setLeaveId(leaveId);
                setOpen(false);
                setLeaveStatus('Cancel Request');
              }}
              style={{ marginTop: 10 + "px" }}
              variant="contained"
            >
              Submit
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  function AdvanceHistory() {
    return (
      <div className="w-full">
        <h1 className="text-3xl text-center font-extrabold">Advance history</h1>
        <table className="w-full rounded-md bg-white table-auto border-collapse border-2 border-gray-300">
          <thead>
            <tr>
              <th className="bg-gray-200 text-black p-4">Amount</th>
              <th className="bg-gray-200 text-black p-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {advanceData.map((advance) => (
              <tr key={advance[0]._id}>
                <td className="border-b border-gray-300 p-4">
                  {advance[0].amount}
                </td>
                <td className="border-b border-gray-300 p-4">
                  {getDate(advance[0].date)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  function DutyHistory() {
    return (
      <div className="w-full">
        <h1 className="text-3xl text-center font-extrabold">Duty History</h1>
        <table className="w-full rounded-md bg-white table-auto border-collapse border-2 border-gray-300">
          <thead>
            <tr>
              <th className="bg-gray-200 text-black p-4">Date</th>
              <th className="bg-gray-200 text-black p-4">Shift type</th>
            </tr>
          </thead>
          <tbody>
            {dutyData.map((advance) => (
              <tr key={advance._id}>
                <td className="border-b border-gray-300 p-4">
                  {getDate(advance.date)}
                </td>
                <td className="border-b border-gray-300 p-4">
                  {advance.shiftType}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
