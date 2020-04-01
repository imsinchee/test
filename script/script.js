const config = {
  apiKey: "AIzaSyBSOUBCNLrJULyPy9e-TQsOw0XkfxSfWAA",
  authDomain: "polar-storm-240813.firebaseapp.com",
  databaseURL: "https://polar-storm-240813.firebaseio.com",
  projectId: "polar-storm-240813",
  storageBucket: "polar-storm-240813.appspot.com",
  messagingSenderId: "572073336908",
  appId: "1:572073336908:web:bdb4731e8bfd390bed14e9",
  measurementId: "G-GP7JV0TLL0"
};
firebase.initializeApp(config);
var database = firebase.database();
var storageRef = firebase.storage().ref();

var width = 320; // We will scale the photo width to this
var height = 0; // This will be computed based on the input stream

// |streaming| indicates whether or not we're currently streaming
// video from the camera. Obviously, we start at false.

var streaming = false;
var ladloc = 0;

// The various HTML elements we need to configure or control. These
// will be set by the startup() function.

var video = null;
var canvas = null;
var photo = null;
var startbutton = null;

var today = new Date();
var time =
  today.getHours() + "h" + today.getMinutes() + "m" + today.getSeconds() + "s";
var picsdata = null;

function startup() {
  video = document.getElementById("video");
  canvas = document.getElementById("canvas");
  photo = document.getElementById("photo");
  startbutton = document.getElementById("startbutton");

  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then(function(stream) {
      video.srcObject = stream;
      video.play();
    })
    .catch(function(err) {
      console.log("An error occurred: " + err);
    });

  video.addEventListener(
    "canplay",
    function(ev) {
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth / width);

        // Firefox currently has a bug where the height can't be read from
        // the video, so we will make assumptions if this happens.

        if (isNaN(height)) {
          height = width / (4 / 3);
        }

        video.setAttribute("width", width);
        video.setAttribute("height", height);
        canvas.setAttribute("width", width);
        canvas.setAttribute("height", height);
        streaming = true;

        takepicture();

        clearphoto();
      }
    },
    false
  );

  // startbutton.addEventListener(
  //   "click",
  //   function(ev) {
  //     takepicture();
  //     ev.preventDefault();
  //   },
  //   false
  // );
}

// Fill the photo with an indication that none has been
// captured.

function clearphoto() {
  var context = canvas.getContext("2d");
  context.fillStyle = "#AAA";
  context.fillRect(0, 0, canvas.width, canvas.height);

  var data = canvas.toDataURL("image/png");
  photo.setAttribute("src", data);
}

// Capture a photo by fetching the current contents of the video
// and drawing it into a canvas, then converting that to a PNG
// format data URL. By drawing it on an offscreen canvas and then
// drawing that to the screen, we can change its size and/or apply
// other changes before drawing it.

function takepicture() {
  var context = canvas.getContext("2d");

  canvas.width = width;
  canvas.height = height;
  context.drawImage(video, 0, 0, width, height);

  var data = canvas.toDataURL("image/png");
  console.log("photo taken");

  picsdata = data;
  photo.setAttribute("src", data);
  console.log(data);
  var image = new Image();
  data = data.split(",", 2)[1];
  console.log(data);
  var text = "image" + Math.floor(100000 + Math.random() * 900000);

  var ref = storageRef.child(text + "/mountains.png");

  ref.putString(data, "base64").then(function(snapshot) {
    console.log(data);
    console.log("Uploaded a data_url string!");
  });
  // database.ref('pics/' + time).set({
  //     pics: data
  // });
  // console.log("success!");
  // console.log(data);

  //   return data
}

window.addEventListener("load", startup, false);
function getLocation() {
  // if (navigator.geolocation) {
  //   navigator.geolocation.getCurrentPosition(showPosition);
  // } else {
  //   console.log("Geolocation is not supported by this browser.");
  // }
}

// function showPosition(position) {
//   // getLocation()
//   x = position.coords.latitude;
//   y = position.coords.longitude;
//   ladloc = x + y;
//   console.log("https://www.openstreetmap.org/#map=15/" + x + "/" + y);

//   takepicture();

//   writeUserData(time, x, y, picsdata);
// }

// function writeUserData(time, lat, long, picture) {
//   console.log("hey");
//   database.ref("data/" + time).set({
//     latitude: lat,
//     longitude: long,
//     pic: picture
//   });

//   console.log("success!");
// }

window.onload = function() {
  startup();
};
