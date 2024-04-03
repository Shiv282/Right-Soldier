var express = require('express');
var app = express();

app.listen('8080',function () {
    console.log("Listening to 8080");
})

app.get('/getGuard/:id',async (req,res)=>{
    const Guard = models.Guard;
    const id = req.params.id;
    const guard = await Guard.find({_id:id});

    res.json({guard: guard});
})

app.get('/getAdvance/:id', async function(req,res){
    const AdvanceHistory = models.AdvanceHistory;
    const id = req.params.id;
    const advanceData = await AdvanceHistory.find({_id:id}); // Pending item : Filtering the Advance History of just one specific month
    
    res.json({advanceData:advanceData});
}) 

app.get('/dutyHistory/:id', async function(req,res){
    const AttendanceHistory = models.AttendanceHistory;
    const id = req.params.id;
    const newAttendanceHistory = await AttendanceHistory.find({guardId:id}); // Pending item : Filtering the Duty History of just one specific month

    res.json({AttendanceHistory:newAttendanceHistory});
}) 