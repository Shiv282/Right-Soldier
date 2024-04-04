import { Button } from "@mui/material";
import Dashboard from "./dashboard";

export default function ApartmentPage() {
  return (
    <>
        <Dashboard />
        <div className="grid gap-4 grid-cols-2 mt-10 mx-10">
        <Button href="/supervisor/markAttendance" variant="contained" color="primary">
        Mark Attendance 
      </Button>
      <Button variant="contained" color="primary">
        View Attendance 
      </Button>
      <Button variant="contained" color="primary">
        Start patrol
      </Button>
      <Button variant="contained" color="primary">
        View Patrol data
      </Button>
        </div>
    </>
  );
}