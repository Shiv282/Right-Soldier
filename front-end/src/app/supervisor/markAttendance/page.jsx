"use client";
import axios from "axios";
import { useEffect, useState } from "react";
var apartmentId = "66082468f79020f63b04bf0c";

async function markAttendance() {
  var boxes = document.querySelectorAll('input[type="checkbox"]');
  var result = [];
  for (var i = 0; i < boxes.length; i++) {
    if (boxes[i].checked) {
      result.push(boxes[i].id);
    }
  }
  var timestamp = new Date();
  const response = await axios({
    method: "POST",
    url: "http://localhost:8080/markAttendance",
    data: {
      id: result,
      apartmentId: apartmentId,
      timestamp: timestamp,
    },
  });
  console.log(response);
  if(response.status==200){
    return true;
  }else{
    return false;
  }
}




export default function MarkAttendancePage() {
  const [pageData, setPageData] = useState([]);
  const [open, setOpen] = useState(false);

  function handleClose(){
    setOpen(true);
  }

  async function submit(){
    var x = await markAttendance();
    
    if(x){
      console.log(x);
      setOpen(true);
    }
  }
  
 

  useEffect(() => {
    async function fetchData() {
      console.log("fetch data");
      const response = await axios({
        method: "POST",
        url: "http://localhost:3000/apartment/guards",
        data: {
          id: apartmentId,
        },
      });
      console.log(response.data.data);
      setPageData(response.data.data);
    }
    fetchData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="my-5">
        <button
          className="bg-white text-black py-2 px-4 rounded-md"
          onClick={submit}
        >
          Submit
        </button>
        
      </div>
      <div className="my-5">
        <span>Note : Attendance once given can't be removed</span>
      </div>
      <div className="mx-20">
        <p>Guard name - Present</p>

        {pageData[0] ? (
          <div>
            {pageData.map((row) => (
              <div key={row._id}>
                <p>
                  {row.name}
                  <input type="checkbox" name={row._id} id={row._id} />
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div>Loading</div>
        )}
      </div>
    </main>
  );
}

