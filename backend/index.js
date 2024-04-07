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

app.get('/getAdvance/:id', async function(req,res){ // For now the functionality is to get each advance, not sure why. Change it to getting based on guardId
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



//------------------
app.post('/markAttendance',async function(req,res){
    const Guard = models.Guard;
    const AttendanceHistory = models.AttendanceHistory;
    const {id, apartmentId} = req.body;
    var presentDay = new Date().toDateString();
    var presentDate = new Date().getTime();

    id.forEach(async (i) => {
        const guardOld = await Guard.find({_id:i,lastPresentDay:presentDay});
        if(guardOld!=0){
            console.log("already marked")
        }else{
            console.log("marked successfully")
            await Guard.findOneAndUpdate({_id: i},{ $inc: { days: 1 },lastPresentDay : presentDay}, { returnNewDocument: true, upsert : true});
            const newAttendanceHistory = new AttendanceHistory({
                guardId : i,
                date : presentDate,
                apartmentId : apartmentId
            });
            await newAttendanceHistory.save();
        }  
    });
    res.sendStatus(200);
})

app.get('/apartmentGuards/:id', async function(req,res){
    const Guard = models.Guard;
    const id = req.params.id;
    const response = await Guard.find({apartmentId: id});

    res.json({data: response});
})

//----
app.post('/getApartment',async (req,res)=>{
    console.log("Get Apartment")
    const Apartment = models.Apartment;
    const id = req.body.id;
    console.log(req.params)
    const apartment = await Apartment.find({_id:id});
    console.log(apartment)
    res.json({data:apartment});
})

app.post('/patrol/add', async (req,res)=>{
    const PatrolHistory = models.PatrolHistory;
    const { title, time, apartmentId } = req.body;
    var newPatrol = new PatrolHistory({
        title: title,
        time: time,
        apartmentId: apartmentId
    });
    await newPatrol.save();
    res.sendStatus(200);
})

//----
app.post('/patrol/get', async (req,res)=>{
    const PatrolHistory = models.PatrolHistory;
    const { startTime, endTime, apartmentId } = req.body;
    const response = await PatrolHistory.find({apartmentId: apartmentId, time: { $gte: startTime, $lt: endTime }});
    res.json(response);
})



//---------------------
app.get('/apartments',async function(req,res){
    const Apartment = models.Apartment;
    const apartments = await Apartment.find();
    res.json({data : apartments});
})

//----
app.post('/addAdvance', async function(req,res){
    const Guard = models.Guard;
    const {guardId, adminId, apartmentId, reason, date, amount} = req.body;
    console.log(req.body);
    const AdvanceHistory = models.AdvanceHistory;

    const newAdvance = new AdvanceHistory({
        guardId: guardId,
        adminId: adminId,
        apartmentId: apartmentId,
        reason: reason,
        date: date,
        amount: amount
    })
    const createdAdvance = await newAdvance.save();
    
    
    const respo = await Guard.findOneAndUpdate({_id: guardId},{ $inc: { advance: amount }, $push: { advanceHistory: createdAdvance._id}});
    console.log(respo);
    res.json({messsage:"Advance updated"});
}) 

//----
app.post('/advanceHistory', async function(req,res){
    const AdvanceHistory = models.AdvanceHistory;
    const {id} = req.body;
    const newAdvanceHistory = await AdvanceHistory.find({guardId:id});
    res.json({AdvanceHistory:newAdvanceHistory});
}) 