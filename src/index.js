// require('../node_modules/handtrackjs/dist/handtrack.min.js');

// console.log('handTrack', handtrack);

// console.log(require('hammerjs'));
console.log(require('../node_modules/handtrackjs/dist/handtrack.min.js'));
// import * as handTrack from 'handtrackjs';
// console.log(handTrack);

// console.log(require('hammer-simulator'));

// console.log(Simulator);


// Simulator.setType('touch');
// Simulator.events.touch.fakeSupport();




// class HandtrackInput extends Hammer.Input {
//   constructor() {
//     super(...arguments);
//     console.log('created!');
//   }

//   handler(ev) {
//     console.log('handler');
//   }
// }

export default function HandtrackTouch () {
  return 'HandtrackTouch';
}
