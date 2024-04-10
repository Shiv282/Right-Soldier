function getDistance(lat1, lon1, lat2, lon2) {
  //Haversine formula
  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadiusKm = 6371; // Radius of the Earth in kilometers

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distanceKm = earthRadiusKm * c;
    return distanceKm;
  }
  const distanceKm = calculateDistance(lat1, lon1, lat2, lon2);
  console.log("Direct distance between A and B:", distanceKm * 1000, "meters");
  return distanceKm * 1000;
}

exports.getDistance = getDistance;

function xyz() {}
  async function readData(lat, lon) {
    var ndef = new NDEFReader();
    ndef
      .scan()
      .then(() => {
        console.log("Scan started successfully.");
        setStatus("Waiting for card tap");
        ndef.onreadingerror = () => {
          console.log("Cannot read data from the NFC tag. Try another one?");
        };
        ndef.onreading = (event) => {
          console.log("NDEF message read.");
          const dataView = new DataView(event.message.records[0].data.buffer);
          const decoder = new TextDecoder("utf-8");
          const decodedString = decoder.decode(dataView);
          console.log(decodedString);
          if (decodedString != "Testing") {
            setStatus("Wrong NFC");
            return;
          }
          var latitude;
          var longitude;
          if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;
                var distance = getDistance(lat, lon, latitude, longitude);
                console.log(distance);
                var patrolPath = response.data[0].patrolPath;
                console.log("Count : " + count);
                if (distance < 100) {
                  var newCount = count + 1;
                  setCount(newCount);
                  if (count > patrolPath.length) {

                    var timeNow = new Date().getTime();
                    const response = await axios({
                        method: "POST",
                        url: "http://localhost:3000/patrol/add",
                        data: {
                          apartmentId: apartmentId,
                          title: title,
                          time: timeNow,
                          guardId: guardId
                        },
                      });
                      console.log(response);

                    setStatus("Patrol Complete");
                    const response2 = await axios({
                      method: "POST",
                      url: "http://localhost:3000/patrol/add",
                      data: {
                        apartmentId: apartmentId,
                        title: "Patrol Completed",
                        time: timeNow,
                        guardId: guardId
                      },
                    });
                    console.log(response2);
                    setTitle("");
                    setLat("");
                    setLon("");
                  } else {
                    console.log(count);
                    setStatus("Click here to mark checkpoint : " + count);

                    var timeNow = new Date().getTime();
                    const response = await axios({
                      method: "POST",
                      url: "http://localhost:3000/patrol/add",
                      data: {
                        apartmentId: apartmentId,
                        title: title,
                        time: timeNow,
                        guardId: guardId
                      },
                    });
                    console.log(response);

                    setTitle(patrolPath[count - 1].title);
                    setLat(patrolPath[count - 1].latitude);
                    setLon(patrolPath[count - 1].longitude);
                  }
                }
                ndef.onreading = xyz;
              },
              (error) => {
                console.error("Error getting geolocation:", error.message);
              }
            );
          } else {
            console.error("Geolocation is not supported by this browser.");
          }
        };
      })
      .catch((error) => {
        console.log(`Error! Scan failed to start: ${error}.`);
      });
  }

async function handlePatrol(setCount, setTitle, setLat, setLon, setStatus, count, status, guardId) {
  console.log(status);
  const response = await axios({
    method: "POST",
    url: "http://localhost:3000/getApartment",
    data: {
      id: apartmentId,
    },
  });
  var patrolPath = response.data[0].patrolPath;
  if (status == "Start") {
    var newCount = count + 1;
    setCount(newCount);
    setStatus("Click here to mark checkpoint : " + count);
    setTitle(patrolPath[0].title);
    setLat(patrolPath[0].latitude);
    setLon(patrolPath[0].longitude);

    var timeNow = new Date().getTime();
    const response = await axios({
      method: "POST",
      url: "http://127.0.0.1:3000/patrol/add",
      data: {
        apartmentId: apartmentId,
        title: "Patrol started",
        time: timeNow,
        guardId: guardId
      },
    });
    console.log(response);

    return;
  }

  console.log(response.data[0].patrolPath);
  if (count > patrolPath.length + 1) {
    console.log("end");
    setCount(0);
    setStatus("Patrol complete");
    setTitle("");
    setLat("");
    setLon("");
    return;
  }
  var lat = patrolPath[count - 2].latitude;
  var lon = patrolPath[count - 2].longitude;
  readData(lat, lon);
}

exports.handlePatrol = handlePatrol;
