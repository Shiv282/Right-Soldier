"use client";
import { useEffect, useState } from "react";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
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
  const [data, setData] = useState([]);
  const [dialogData, setDialogData] = useState([]);
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  
  const handleOpen = async (event) => {
    var id = event.target.getAttribute("data-key");
    var name = event.target.innerText;
    setDialogData([id, name]);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addAdvance = async (event) => {
    var date = new Date();
    var guardId = event.target.getAttribute("data-key");
    console.log(guardId);
    var amount = document.getElementById("amount").value;
    var reason = document.getElementById("reason").value;
    var adminId = "65e0d05b34587bb61c4edc8c"
    const response = await axios({
      method: "POST",
      url: "http://localhost:3000/addAdvance",
      data: {
        adminId: adminId,
        guardId: guardId,
        apartmentId: apartmentId,
        amount: amount,
        date: date,
        reason: reason,
      },
    });
    console.log(response);
    handleClose();
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
        <h1>Grant advance</h1>
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
        <DialogTitle>
          {dialogData[1]} : {dialogData[0]}
        </DialogTitle>
        <DialogContent dividers className={classes.dialogContent}>
          <label htmlFor="amount">Enter amount</label>
          <input type="number" name="amount" id="amount" />
          <label htmlFor="reason">Enter reason</label>
          <input type="text" name="reason" id="reason" />
          <Button
            color="success"
            data-key={dialogData[0]}
            onClick={addAdvance}
            style={{ marginTop: 10 + "px" }}
            variant="contained"
          >
            Submit
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
