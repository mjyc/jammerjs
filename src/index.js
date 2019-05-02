const handtrack = require('../node_modules/handtrackjs/dist/handtrack.min.js');
require('../node_modules/hammer-simulator/index.js');

console.log('handTrack', handtrack);
console.log(Simulator);

// function startVideo() {
//     handTrack.startVideo(video).then(function (status) {
//       console.log("video started", status);
//       if (status) {
//         // updateNote.innerText = "Video started. Now tracking"
//         isVideo = true
//         // runDetection()
//       } else {
//         // updateNote.innerText = "Please enable video"
//       }
//     });
//   }

export default function HandtrackTouch () {
  return 'HandtrackTouch';
}
