var express = require("express");
var app = express();
const cors = require("cors");

//Database connection
const mongoose = require("mongoose");
const DB_url = "mongodb://localhost:27017/";
mongoose
  .connect(DB_url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("DATABASE CONNECTION Successful");
  })
  .catch((err) => {
    console.log("error");
    console.log(err);
  });

//Importing models
let models = require("./db/models.js");

//middlewares
app.use(express.json());
app.use(cors());

app.listen("8080", function () {
  console.log("Listening to 8080");
});

app.get("/getGuard/:id", async (req, res) => {
  const Guard = models.Guard;
  const id = req.params.id;
  const guard = await Guard.find({ _id: id });

  res.json({ guard: guard });
});

app.get("/getAdvance/:id", async function (req, res) {
  // For now the functionality is to get each advance, not sure why. Change it to getting based on guardId
  const AdvanceHistory = models.AdvanceHistory;
  const id = req.params.id;
  const advanceData = await AdvanceHistory.find({ _id: id }); // Pending item : Filtering the Advance History of just one specific month

  res.json({ advanceData: advanceData });
});

app.get("/dutyHistory/:id", async function (req, res) {
  console.log("Duty history");
  const AttendanceHistory = models.AttendanceHistory;
  const id = req.params.id;
  const newAttendanceHistory = await AttendanceHistory.find({ guardId: id }); // Pending item : Filtering the Duty History of just one specific month

  res.json({ AttendanceHistory: newAttendanceHistory });
});

app.post("/requestLeave", async (req, res) => {
  const LeaveRequest = models.LeaveRequest;
  const Guard = models.Guard;
  const { guardId, apartmentId, date, reason, guardName } = req.body;
  const expiry = new Date(date);
  console.log(expiry);
  expiry.setDate(expiry.getDate() + 1);
  expiry.setHours(0, 0, 0, 0);
  console.log(expiry);
  const expiryTimestamp = expiry;

  const newLeaveRequest = new LeaveRequest({
    guardId: guardId,
    apartmentId: apartmentId,
    date: date,
    reason: reason,
    expiryTimestamp: expiryTimestamp,
    guardName: guardName
  });
  const response = await newLeaveRequest.save();
  console.log(response._id);

  const updatedDocument = await Guard.findOneAndUpdate(
    { _id: guardId },
    {
      $set: {
        "leave.leaveId": response._id,
        "leave.expiryTimestamp": expiryTimestamp,
      },
    },
    { new: true } // To return the updated document
  );

  if (updatedDocument) {
    console.log(`Updated Document: ${updatedDocument}`);
  } else {
    console.log("Document not found.");
  }

  res.send(updatedDocument.leave.leaveId);
});

app.delete("/deleteLeave/", async (req, res) => {
  const LeaveRequest = models.LeaveRequest;
  const leaveId = req.query.leaveId;
  const guardId = req.query.guardId;
  const result = await LeaveRequest.deleteOne({ _id: leaveId });

  const Guard = models.Guard;
  const updatedDocument = await Guard.findOneAndUpdate(
    { _id: guardId },
    { $unset: { leave: 1 } },
    { new: true } // To return the updated document
  );

  if (updatedDocument) {
    console.log(`Updated Document: ${updatedDocument}`);
  } else {
    console.log("Document not found.");
  }
  res.sendStatus(200);
});

app.post("/requestAdvance", async (req, res) => {
  const AdvanceRequest = models.AdvanceRequest;
  const Guard = models.Guard;
  const { guardId, apartmentId, amount, reason, guardName } = req.body;
  console.log(guardName);
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);
  expiry.setHours(0, 0, 0, 0);
  const expiryTimestamp = expiry;

  const newAdvanceRequest = new AdvanceRequest({
    guardId: guardId,
    apartmentId: apartmentId,
    amount: amount,
    reason: reason,
    expiryTimestamp: expiryTimestamp,
    guardName: guardName
  });
  const response = await newAdvanceRequest.save();

  const updatedDocument = await Guard.findOneAndUpdate(
    { _id: guardId },
    {
      $set: {
        "advanceRequest.advanceRequestId": response._id,
        "advanceRequest.expiryTimestamp": expiryTimestamp,
      },
    },
    { new: true } // To return the updated document
  );

  if (updatedDocument) {
    console.log(`Updated Document: ${updatedDocument}`);
  } else {
    console.log("Document not found.");
  }

  res.send(updatedDocument.advanceRequest.advanceRequestId);
});

app.delete("/deleteAdvance/", async (req, res) => {
  const AdvanceRequest = models.AdvanceRequest;
  const advanceRequestId = req.query.advanceRequestId;
  const guardId = req.query.guardId;
  const result = await AdvanceRequest.deleteOne({ _id: advanceRequestId });

  const Guard = models.Guard;
  const updatedDocument = await Guard.findOneAndUpdate(
    { _id: guardId },
    { $unset: { advanceRequest: 1 } },
    { new: true } // To return the updated document
  );

  if (updatedDocument) {
    console.log(`Updated Document: ${updatedDocument}`);
  } else {
    console.log("Document not found.");
  }
  res.sendStatus(200);
});

app.get('/advanceRequests', async (req,res) => {
    const AdvanceRequest = models.AdvanceRequest;
    const response = await AdvanceRequest.find({});
    res.send(response);
})

app.get('/leaveRequests', async (req,res) => {
    const LeaveRequest = models.LeaveRequest;
    const response = await LeaveRequest.find({});
    res.send(response);
})

app.get("/markedAttendance", async (req, res) => {
  const AttendanceHistory = models.AttendanceHistory;
  const currentDate = new Date();
  const startOfDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );
  const endOfDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() + 1
  );

  const counts = await AttendanceHistory.aggregate([
    {
      $match: {
        date: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      },
    },
    {
      $group: {
        _id: {
          apartmentName: "$apartmentName",
          shiftType: "$shiftType",
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        apartmentName: "$_id.apartmentName",
        shiftType: "$_id.shiftType",
        count: 1,
      },
    },
  ]);

  res.send(counts);
});

//------------------
app.post("/markAttendance", async function (req, res) {
  const Guard = models.Guard;
  const AttendanceHistory = models.AttendanceHistory;
  const { id, apartmentId, timestamp, apartmentName } = req.body;
  var presentDay = new Date().toDateString();
  var presentDate = new Date().getTime();
  var shiftType;
  var newTimestamp = new Date(timestamp);
  if (newTimestamp.getHours() < 18) {
    shiftType = "day";
  } else {
    shiftType = "night";
  }
  id.forEach(async (i) => {
    if (shiftType == "day") {
      const guardOld = await Guard.find({ _id: i, lastPresentDay: presentDay });
      if (guardOld != 0) {
        console.log("already marked");
      } else {
        console.log("marked successfully");
        await Guard.findOneAndUpdate(
          { _id: i },
          { $inc: { days: 1 }, lastPresentDay: presentDay },
          { returnNewDocument: true, upsert: true }
        );
        const newAttendanceHistory = new AttendanceHistory({
          guardId: i,
          date: presentDate,
          apartmentId: apartmentId,
          shiftType: shiftType,
          apartmentName: apartmentName,
        });
        await newAttendanceHistory.save();
      }
    } else {
      const guardOld = await Guard.find({
        _id: i,
        lastPresentNight: presentDay,
      });
      if (guardOld != 0) {
        console.log("already marked");
      } else {
        console.log("marked successfully");
        await Guard.findOneAndUpdate(
          { _id: i },
          { $inc: { nights: 1 }, lastPresentNight: presentDay },
          { returnNewDocument: true, upsert: true }
        );
        const newAttendanceHistory = new AttendanceHistory({
          guardId: i,
          date: presentDate,
          apartmentId: apartmentId,
          shiftType: shiftType,
        });
        await newAttendanceHistory.save();
      }
    }
  });
  res.sendStatus(200);
});

app.get("/apartmentGuards/:id", async function (req, res) {
  const Guard = models.Guard;
  const id = req.params.id;
  const response = await Guard.find({ apartmentId: id });

  res.json({ data: response });
});

//----
app.post("/addGuard", async (req, res) => {
  console.log("Add guard");
  const Guard = models.Guard;
  const { name, apartmentName, apartmentId, salary, dateOfJoining, phone } =
    req.body;
  console.log(name);
  const guardPresentcheck = await Guard.find({ name: name });
  if (guardPresentcheck.length == 0) {
    const newGuard = new Guard({
      name: name,
      salary: salary,
      apartmentName: apartmentName,
      apartmentId: apartmentId,
      days: 0,
      lastPresentDay: "No marked Attendance",
      nights: 0,
      lastPresentNight: "No marked Attendance",
      advance: 0,
      advanceHistory: [],
      dateOfJoining: dateOfJoining,
      phone: phone,
    });
    await newGuard.save();
    res.json({ message: "Guard added successfully" });
  } else {
    res.sendStatus(400);
  }
});

app.post("/getApartment", async (req, res) => {
  console.log("Get Apartment");
  const Apartment = models.Apartment;
  const id = req.body.id;
  console.log(req.params);
  const apartment = await Apartment.find({ _id: id });
  console.log(apartment);
  res.json({ data: apartment });
});

app.post("/patrol/add", async (req, res) => {
  const PatrolHistory = models.PatrolHistory;
  const { title, time, apartmentId, guardId } = req.body;
  var newPatrol = new PatrolHistory({
    title: title,
    time: time,
    apartmentId: apartmentId,
    guardId: guardId,
  });
  await newPatrol.save();
  res.sendStatus(200);
});

//----
app.post("/patrol/get", async (req, res) => {
  const PatrolHistory = models.PatrolHistory;
  const { startTime, endTime, apartmentId } = req.body;
  const response = await PatrolHistory.find({
    apartmentId: apartmentId,
    time: { $gte: startTime, $lt: endTime },
  });
  res.json(response);
});

app.post("/myPatrol", async (req, res) => {
  const PatrolHistory = models.PatrolHistory;
  const { startTime, endTime, guardId } = req.body;
  const response = await PatrolHistory.find({
    guardId: guardId,
    time: { $gte: startTime, $lt: endTime },
  });
  res.json(response);
});

//---------------------
app.get("/apartments", async function (req, res) {
  const Apartment = models.Apartment;
  const apartments = await Apartment.find();
  res.json({ data: apartments });
});

//----
app.post("/addAdvance", async function (req, res) {
  const Guard = models.Guard;
  const { guardId, adminId, apartmentId, reason, date, amount } = req.body;
  console.log(req.body);
  const AdvanceHistory = models.AdvanceHistory;

  const newAdvance = new AdvanceHistory({
    guardId: guardId,
    adminId: adminId,
    apartmentId: apartmentId,
    reason: reason,
    date: date,
    amount: amount,
  });
  const createdAdvance = await newAdvance.save();

  const respo = await Guard.findOneAndUpdate(
    { _id: guardId },
    { $inc: { advance: amount }, $push: { advanceHistory: createdAdvance._id } }
  );
  console.log(respo);
  res.json({ messsage: "Advance updated" });
});

//----
app.post("/advanceHistory", async function (req, res) {
  const AdvanceHistory = models.AdvanceHistory;
  const { id } = req.body;
  const newAdvanceHistory = await AdvanceHistory.find({ guardId: id });
  res.json({ AdvanceHistory: newAdvanceHistory });
});
