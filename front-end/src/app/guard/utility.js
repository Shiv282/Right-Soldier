import { makeStyles } from "@mui/styles";
import axios from "axios";


const useStyles = makeStyles((theme) => ({
  dialogContent: {
    maxHeight: 400, // Adjust the max height as needed
    overflowY: "auto",
  },
}));
exports.useStyles = useStyles;

async function updateAdvanceHistoryPopUp(val) {
  var advanceData = [];
  var advanceHistory = val[0].advanceHistory;
  for (var i = 0; i < advanceHistory.length; i++) {
    var advanceId = advanceHistory[i];
    const response = await axios({
      method: "GET",
      url: "http://localhost:8080/getAdvance/"+advanceId,
    });
    advanceData.push(response.data.advanceData);
  }
  return advanceData;
}
exports.updateAdvanceHistoryPopUp = updateAdvanceHistoryPopUp;

async function fetchData(setVal, id) {
  const response = await axios({
    method: "GET",
    url: "http://localhost:8080/getGuard/"+id
  });
  setVal(response.data.guard);
}
exports.fetchData = fetchData;

function getDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}
exports.getDate = getDate;

async function updateDutyData(id) {
  const response = await axios({
    method: "GET",
    url: "http://localhost:8080/dutyHistory/"+id,
  });
  return response.data.AttendanceHistory;
}
exports.updateDutyData = updateDutyData;
