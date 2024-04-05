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

async function handlePatrol(setState, setCount, count, status) {
    console.log(status);
    if(status == "Start"){
        var newCount = count + 1;
        setCount(newCount);
        setStatus("Click here to mark checkpoint : " + count);
        return
    }

    const response = await axios({
      method: "POST",
      url: "http://localhost:3000/getApartment",
      data: {
        id: apartmentId,
      },
    });
    console.log(response.data.data[0].patrolPath);
    var patrolPath = response.data.data[0].patrolPath;
    if(count > patrolPath.length+1){
        console.log("end")
        return
    }

    var nfcData = await readData();
    console.log(nfcData);
    var lat = patrolPath[count - 2].latitude;
    var lon = patrolPath[count - 2].longitude;
    var latitude;
    var longitude;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
          console.log("Current Latitude:", latitude);
          console.log("Current Longitude:", longitude);
          console.log("Target Latitude:", lat);
          console.log("Target Longitude:", lon);
          var distance = getDistance(lat, lon, latitude, longitude);
          console.log(distance);
          if (distance < 10) {
            var newCount = count + 1;
            setCount(newCount);
            setStatus("Click here to mark checkpoint : " + count);
          }
        },
        (error) => {
          console.error("Error getting geolocation:", error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }

  exports.handlePatrol = handlePatrol;