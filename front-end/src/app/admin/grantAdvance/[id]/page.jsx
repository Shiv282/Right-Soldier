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
  
  const handleOpen = async (id,name) => {
    console.log(id);
    setDialogData([id, name]);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addAdvance = async (guardId) => {
    var date = new Date();
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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl text-center font-extrabold mb-3">
          Choose Guard
        </h1>
        <div className=" bg-slate-200 p-3 shadow-xl" key={"data"}>
          <table className="w-full">
            <thead className="bg-black text-white">
              <tr>
                <th className="text-left px-3">Guard name</th>
              </tr>
            </thead>
            <tbody>
              <>
                {data.map((guard) => (
                  <tr className="hover:bg-slate-300">
                    <td>
                      <a
                        key={guard.guardId}
                        data-key={guard.guardId}
                        onClick={()=>{handleOpen(guard.guardId,guard.name)}}
                      >
                        <div className="w-full p-1 px-2">
                        {guard.name}
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
            onClick={()=>{addAdvance(dialogData[0])}}
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
