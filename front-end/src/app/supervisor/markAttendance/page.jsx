"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "@/components/loader";
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
  if (response.status == 200) {
    return true;
  } else {
    return false;
  }
}

export default function MarkAttendancePage() {
  const [pageData, setPageData] = useState([]);
  const [open, setOpen] = useState(false);

  function handleClose() {
    setOpen(true);
  }

  async function submit() {
    var x = await markAttendance();

    if (x) {
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
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="my-5">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-md"
          onClick={submit}
        >
          Mark Attendance
        </button>
      </div>
      <div className="my-5">
        <table className="w-full bg-white rounded-md shadow-md">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Present
              </th>
            </tr>
          </thead>
          <tbody>
            {pageData[0] ? (
              pageData.map((row) => (
                <tr key={row._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {row.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input type="checkbox" name={row._id} id={row._id} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="px-6 py-4 text-center">
                  <Loader />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
    </main>
  );
}
