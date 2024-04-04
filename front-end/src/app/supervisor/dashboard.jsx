"use client";
import { useEffect, useState } from "react";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import {
  useStyles,
  updateAdvanceHistoryPopUp,
  fetchData,
  getDate,
  updateDutyData
} from "./utility";

export default function Dasboard() {
  const [userData, setUserData] = useState([]);
  const classes = useStyles();
  const [openAdvanceHistory, setOpenAdvanceHistory] = useState(false);
  const [advanceData, setAdvanceData] = useState([]);

  const [openDutyHistory, setOpenDutyHistory] = useState(false);
  const [dutyData, setDutyData] = useState([]);

  const handleOpenAdvanceHistory = async () => {
    var advanceData = await updateAdvanceHistoryPopUp(userData);
    setAdvanceData(advanceData);
    setOpenAdvanceHistory(true);
  };
  const handleCloseAdvanceHistory = () => {
    setOpenAdvanceHistory(false);
  };

  const handleOpenDutyHistory = async () => {
    var dutyData = await updateDutyData();
    setDutyData(dutyData);
    setOpenDutyHistory(true);
  };
  const handleCloseDutyHistory = () => {
    setOpenDutyHistory(false);
  };

  useEffect(() => {
    fetchData(setUserData);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-3xl">Supervisor Page </h1>
      <div>
        {userData[0] ? (
          <div>
            <h2> Name : {userData[0].name}</h2>
            <h2> Salary : {userData[0].salary}</h2>
            <h2> Apartment Name : {userData[0].apartmentName}</h2>
            <h2> Advance : {userData[0].advance}</h2>
            <h2> Days : {userData[0].days}</h2>
            <h2> Nights : {userData[0].nights}</h2>

            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenAdvanceHistory}
            >
              Advance History
            </Button>
            <Dialog
              open={openAdvanceHistory}
              onClose={handleCloseAdvanceHistory}
              scroll="paper"
            >
              <DialogTitle>Advance History</DialogTitle>
              <DialogContent dividers className={classes.dialogContent}>
                {
                  /* Add your scrollable content here */ console.log(
                    advanceData
                  )
                }
                {advanceData.map((advance) => (
                  <p key={advance[0]._id}>
                    Amount : {advance[0].amount} Date :{" "}
                    {getDate(advance[0].date)}
                  </p>
                ))}
              </DialogContent>
            </Dialog>

            <div className="mt-3">
              <Button variant="contained" color="primary" onClick={handleOpenDutyHistory}>
                Duty History
              </Button>
              <Dialog open={openDutyHistory} onClose={handleCloseDutyHistory} scroll="paper">
                <DialogTitle>Duty History</DialogTitle>
                <DialogContent dividers className={classes.dialogContent}>
                  {
                    /* Add your scrollable content here */ console.log(
                      advanceData
                    )
                  }
                  {dutyData.map((advance) => (
                    <p key={advance._id}>Date : {getDate(advance.date)}</p>
                  ))}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ) : (
          <div>Loading</div>
        )}
      </div>
    </main>
  );
}
