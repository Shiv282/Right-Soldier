"use client";
import { useEffect, useState } from "react";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";

const adminId = "65e0d05b34587bb61c4edc8c";

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    maxHeight: 400, // Adjust the max height as needed
    overflowY: "auto",
  },
}));

export default function AdminAttendance({ params }) {
  const [data, setData] = useState([]);
  const [dutyData, setDutyData] = useState([]);
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const apartmentId = params.id;

  function getDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

  const handleOpen = async (event) => {
    var id = event.target.getAttribute("data-key");
    const response = await axios({
      method: "POST",
      url: "http://localhost:3000/dutyHistory",
      data: {
        id,
      },
    });
    setDutyData(response.data.AttendanceHistory);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const dataRead = async () => {
        const response = await axios({
          method: "GET",
          url: "http://localhost:3000/apartment/" + apartmentId,
        });
        console.log(apartmentId);
        const rows = response.data.data[0].guards;
        console.log(rows);
        setData(rows);
      };
      dataRead();
  }, []);

  return (
    <>
      <div>
        <h1>Attendance history</h1>
        {data.map((guard) => (
          <Button
            color="success"
            data-key={guard.guardId}
            onClick={handleOpen}
            style={{ marginTop: 10 + "px" }}
            variant="contained"
            key={guard.guardId}
          >
            {guard.name}
          </Button>
        ))}
      </div>
      <Dialog open={open} onClose={handleClose} scroll="paper">
        <DialogTitle>Duty History</DialogTitle>
        <DialogContent dividers className={classes.dialogContent}>
          {dutyData.map((duty) => (
            <p key={duty._id}>
              Date : {getDate(duty.date)} -- {duty.apartmentId}
            </p>
          ))}
        </DialogContent>
      </Dialog>
    </>
  );
}
