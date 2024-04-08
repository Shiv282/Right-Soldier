"use client"
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    maxHeight: 400, // Adjust the max height as needed
    overflowY: "auto",
  },
}));

export default function AdminHomePage() {

    const [dialogData, setDialogData] = useState([]);
    const [apartments, setApartments] = useState([]);
    const [guards, setGuards] = useState([]);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(null);
    const [addExistingGuardDialog, setAddExistingGuardDialog] = useState(false)
    const [guardDialog, setGuardDialog] = useState(false);
    const classes = useStyles();

    const addExistingGuard = async () => {
        var apartmentId = document.getElementById('apartmentName').value;
        var guardId = document.getElementById('guardName').value;
        var guardName = document.getElementById('guardName').options[document.getElementById('guardName').selectedIndex].text;
        const response = await axios({
            method: 'POST',
            url: "http://localhost:3000/addExistingGuard",
            data: {
                guardId: guardId,
                guardName: guardName, 
                apartmentId: apartmentId
            }
          });
        console.log(response);
    }

    const addApartment = async () =>{
        var location = document.getElementById('location').value;
        var apartmentName = document.getElementById('apartmentName').value;
        try{
            const response = await axios({
                method: 'POST',
                url: "http://localhost:3000/addApartment",
                data: {
                    location: location,
                    apartmentName: apartmentName,
                    supervisorName: "supervisorName",
                    supervisorId: "66083795e85721253d79b143"
                }
              });
        }catch (error) {
            console.error('Error:', error);
            if(error.response.status == 400){
                setDialogData("Apartment already exists");
            }
            setError(error.message || 'An error occurred');
            document.getElementById('location').value = "";
            document.getElementById('apartmentName').value = "";
          }
          
        handleClose();
      }

      const addGuard = async () =>{
        var guardName = document.getElementById('guardName').value;
        var apartmentId = document.getElementById('apartmentName').value;
        var salary = document.getElementById('salary').value;
        var phone = document.getElementById('phone').value;
        var apartmentName = document.getElementById('apartmentName').options[document.getElementById('apartmentName').selectedIndex].text;
        const currentDate = new Date();
        const date = currentDate.getDate();
        const month = currentDate.getMonth() + 1;  // JavaScript months are 0-based, so we add 1
        const year = currentDate.getFullYear();
        var timestamp = date+" - "+month+" - "+year;
        try{
            const response = await axios({
                method: 'POST',
                url: "http://localhost:8080/addGuard",
                data: {
                    name: guardName,
                    apartmentName: apartmentName,
                    apartmentId: apartmentId,
                    salary: salary,
                    dateOfJoining: timestamp,
                    phone: phone
                }
              });
              console.log(response);
              closeGuard();
        }catch (error) {
            console.error('Error:', error);
            if(error.response.status == 400){
                setDialogData("Guard already exists");
            }
            setError(error.message || 'An error occurred');
            document.getElementById('guardName').value = "";
          }
      }

      

  const handleOpen = async (event) => {
    var clicked = event.target.getAttribute('data-key');
    setDialogData("Add apartment");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const openGuard = async (event) => {
    setDialogData("Add Guard");
    const response = await axios({
      method: 'GET',
      url: "http://localhost:3000/apartments",
    });
    console.log(response.data.data);
    setApartments(response.data.data);
    setGuardDialog(true);
  };

  const closeGuard = () => {
    setGuardDialog(false);
  };

  const addExistingGuardDialogOpen =async ()=>{

    const response = await axios({
        method: 'GET',
        url: "http://localhost:3000/apartments",
      });
      console.log(response.data.data);
      setApartments(response.data.data);
      const guards = await axios({
        method: 'GET',
        url: "http://localhost:3000/guards",
      });
      console.log(guards.data.data);
      setGuards(guards.data.data);
    setAddExistingGuardDialog(true);
  }

  const addExistingGuardDialogClose = ()=>{
    setAddExistingGuardDialog(false);
  }
  return (
    <>
      <div>
        <h1>Admin Home Page : {error && <p>Error: {error}</p>}</h1>
        <div>
          <Button
            href="/admin/grantAdvance"
            color="success"
            style={{ marginTop: 10 + "px" }}
            variant="contained"
          >
            Grant advance
          </Button>
        </div>
        <div>
          <Button
            color="success"
            onClick={handleOpen}
            style={{ marginTop: 10 + "px" }}
            variant="contained"
            data-key="Add apartment"
          >
            Add apartment
          </Button>
        </div>
        <div>
          <Button
            color="success"
            onClick={openGuard}
            style={{ marginTop: 10 + "px" }}
            variant="contained"
            data-key="Add Guard"
          >
            Add guard
          </Button>
        </div>
        <div>
          <Button
            color="success"
            style={{ marginTop: 10 + "px" }}
            variant="contained"
            data-key="Add Guard"
            onClick={addExistingGuardDialogOpen}
          >
            Add existing guard
          </Button>
        </div>
        <div>
          <Button
            href="/admin/attendance"
            color="success"
            style={{ marginTop: 10 + "px" }}
            variant="contained"
          >
            Attendance
          </Button>
        </div>
        <div>
          <Button
            href="/admin/payroll"
            color="success"
            style={{ marginTop: 10 + "px" }}
            variant="contained"
          >
            View Payrol
          </Button>
        </div>
        <div>
          <Button
            href="/admin/patrol"
            color="success"
            style={{ marginTop: 10 + "px" }}
            variant="contained"
          >
            View patrol info
          </Button>
        </div>

        <Dialog open={addExistingGuardDialog} onClose={addExistingGuardDialogClose} scroll="paper">
          <DialogTitle>
            Add existing guard
          </DialogTitle>
          <DialogContent dividers className={classes.dialogContent}>
            <div>
            <label className="mr-5" htmlFor="apartmentName">Choose apartment</label>
            <select name="apartmentName" id="apartmentName">
                {apartments.map((apartment)=>(<option key={apartment._id} value={apartment._id}>{apartment.apartmentName}</option>))}
            </select>
            </div>
            <div>
            <label className="mr-5" htmlFor="location">Choose Guard</label>
            <select name="guardName" id="guardName">
            {guards.map((guard)=>(<option key={guard._id} value={guard._id}>{guard.name}</option>))}
                
            </select>
            </div>
            <Button
              color="success"
              onClick={addExistingGuard}
              style={{ marginTop: 10 + "px" }}
              variant="contained"
            >
              Submit
            </Button>
          </DialogContent>
        </Dialog>

        <Dialog open={open} onClose={handleClose} scroll="paper">
          <DialogTitle>
            {dialogData}
          </DialogTitle>
          <DialogContent dividers className={classes.dialogContent}>
            <div>
            <label htmlFor="apartmentName">Enter apartmentName</label>
            <input type="text" name="apartmentName" id="apartmentName" />
            </div>
            <div>
            <label htmlFor="location">Enter location</label>
            <input type="text" name="location" id="location" />
            </div>
            <Button
              color="success"
              onClick={addApartment}
              style={{ marginTop: 10 + "px" }}
              variant="contained"
            >
              Submit
            </Button>
          </DialogContent>
        </Dialog>

        <Dialog open={guardDialog} onClose={closeGuard} scroll="paper">
          <DialogTitle>
            {dialogData}
          </DialogTitle>
          <DialogContent dividers className={classes.dialogContent}>
            <div>
            <label htmlFor="guardName">Enter Name</label>
            <input type="text" name="guardName" id="guardName" />
            </div>
            <div>
            <label className="mr-5" htmlFor="apartmentName">Choose apartment</label>
            <select name="apartmentName" id="apartmentName">
                {apartments.map((apartment)=>(<option key={apartment._id} value={apartment._id}>{apartment.apartmentName}</option>))}
            </select>
            </div>
            <div>
            <label className="mr-5" htmlFor="salary">Enter salary</label>
            <input type="number" name="salary" id="salary" />
            </div>
            <div>
            <label className="mr-5" htmlFor="phone">Enter phone number</label>
            <input type="number" name="phone" id="phone" />
            </div>
            <Button
              color="success"
              onClick={addGuard}
              style={{ marginTop: 10 + "px" }}
              variant="contained"
            >
              Submit
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
