const socket = io();

//check if browser supports geolocation
if (navigator.geolocation) {
  navigator.geolocation.watchPosition((position) => {
    const { latitude, longitude } = position.coords;

    socket.emit('send-location', { latitude, longitude });
  }, (error) => {
    console.error(error);
  }, {
    enableHighAccuracy: true,
    timeout: 5 * 1000, //5 seconds
    maximumAge: 0
  });
}


//render map
const map = L.map('map').setView([0,0], 16); //create element with id map and set view to 0,0 and zoom level 16

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: "Test Name"
}).addTo(map); //add tile layer to map


//render markers
const markers = {}

socket.on('receive-location', ({ id, latitude, longitude }) => {
  map.setView([latitude, longitude]);

  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});

socket.on('user-disconnected', (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});