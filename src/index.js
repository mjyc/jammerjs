const handtrack = require('../node_modules/handtrackjs/dist/handtrack.min.js');
require('../node_modules/hammer-simulator/index.js');

console.log('handTrack', handtrack);
console.log(Simulator);

export default function HandtrackTouch () {
  return 'HandtrackTouch';
}
