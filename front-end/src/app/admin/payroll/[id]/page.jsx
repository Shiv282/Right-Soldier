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
  const [dutyData, setDutyData] = useState([]);
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  function getDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

  const handleOpen = async (event) => {
    var id = event.target.getAttribute('data-key');
    const response = await axios({
      method: "POST",
      url: "http://localhost:3000/advanceHistory",
      data: {
        id,
      },
    });
    setDutyData(response.data.AdvanceHistory);
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
                        onClick={handleOpen}
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
          Payroll History
        </DialogTitle>
        <DialogContent dividers className={classes.dialogContent}>
          {dutyData.map((duty) => (
            <p key={duty._id}>Date : {getDate(duty.date)} -- {duty.amount}</p>
          ))}
        </DialogContent>
      </Dialog>
    </>
  );

}