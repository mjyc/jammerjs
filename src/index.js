const handTrack = require('../node_modules/handtrackjs/dist/handtrack.min.js');
require('../node_modules/hammer-simulator/index.js');


const start = async (element, video, canvas, {
  model = null,
  modelParams = {},
} = {}) => {
  modelParams = {
    flipHorizontal: true,   // flip e.g for video
    maxNumBoxes: 2,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.6,    // confidence threshold for predictions.
    ...modelParams,
  };

  if (!model) model = await handTrack.load(modelParams);
  let videoStatus = await handTrack.startVideo(video);
  if (!videoStatus) throw 'Start video failed';


  const videoWidth = video.width;
  const videoHeight = video.height;

  let lastPredictions = [];
  let touches = [];
  function runDetection() {
    model.detect(video).then(predictions => {
      model.renderPredictions(predictions, canvas, context, video);

      if (lastPredictions.length === 0 && predictions.length > 0) {
        touches = [{
          x: (predictions[0].bbox[0] + 0.5 * predictions[0].bbox[2]) /
              videoWidth * element.offsetWidth + element.offsetLeft,
          y: (predictions[0].bbox[1] + 0.5 * predictions[0].bbox[3]) /
              videoHeight * element.offsetHeight + element.offsetTop,
          target: element,
        }];
        Simulator.events.touch.trigger(touches, touches[0].target, 'start');
      } else if (predictions.length === 0 && lastPredictions.length > 0) {
        touches = [{
          x: (lastPredictions[0].bbox[0] + 0.5 * lastPredictions[0].bbox[2]) /
              videoWidth * element.offsetWidth + element.offsetLeft,
          y: (lastPredictions[0].bbox[1] + 0.5 * lastPredictions[0].bbox[3]) /
              videoHeight * element.offsetHeight + element.offsetTop,
          target: element,
        }];
        Simulator.events.touch.trigger(touches, touches[0].target, 'end');
      } else if (predictions.length > 0) {
        touches = [{
          x: (predictions[0].bbox[0] + 0.5 * predictions[0].bbox[2]) /
              videoWidth * element.offsetWidth + element.offsetLeft,
          y: (predictions[0].bbox[1] + 0.5 * predictions[0].bbox[3]) /
              videoHeight * element.offsetHeight + element.offsetTop,
          target: element,
        }];
        Simulator.events.touch.trigger(touches, touches[0].target, 'move');
      }
      lastPredictions = predictions;

      requestAnimationFrame(runDetection);
    });
  }


  runDetection();
}


export {
  start
};
