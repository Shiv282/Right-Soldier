import { makeStyles } from "@mui/styles";
import axios from "axios";

var id = "660824960595f408c623ed89";

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
    console.log(advanceId);
    const response = await axios({
      method: "POST",
      url: "http://localhost:3000/getAdvance",
      data: {
        id: advanceId,
      },
    });
    advanceData.push(response.data.advanceData);
  }
  console.log(advanceData);
  return advanceData;
}
exports.updateAdvanceHistoryPopUp = updateAdvanceHistoryPopUp;

async function fetchData(setVal) {
  console.log(id);
  const response = await axios({
    method: "POST",
    url: "http://localhost:3000/getGuard",
    data: {
      id: "660824960595f408c623ed89",
    },
  });
  console.log(response.data);
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

async function updateDutyData() {
  const response = await axios({
    method: "POST",
    url: "http://localhost:3000/dutyHistory",
    data: {
      id,
    },
  });
  return response.data.AttendanceHistory;
}
exports.updateDutyData = updateDutyData;
