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

  let videoStatus = await handTrack.startVideo(video);
  if (!videoStatus) throw 'Start video failed';
  if (!model) model = await handTrack.load(modelParams);


  const videoWidth = video.width;
  const videoHeight = video.height;

  let lastPredictions = [];
  let touches = [];
  function runDetection() {
    model.detect(video).then(predictions => {
      model.renderPredictions(predictions, canvas, context, video);

      if (lastPredictions.length === 0 && predictions.length > 0) {
        touches = predictions.map(prediction => ({
          x: (prediction.bbox[0] + 0.5 * prediction.bbox[2]) /
              videoWidth * element.offsetWidth + element.offsetLeft,
          y: (prediction.bbox[1] + 0.5 * prediction.bbox[3]) /
              videoHeight * element.offsetHeight + element.offsetTop,
          target: element,
        }));
        Simulator.events.touch.trigger(touches, touches[0].target, 'start');
      } else if (predictions.length === 0 && lastPredictions.length > 0) {
        touches = lastPredictions.map(prediction => ({
          x: (prediction.bbox[0] + 0.5 * prediction.bbox[2]) /
              videoWidth * element.offsetWidth + element.offsetLeft,
          y: (prediction.bbox[1] + 0.5 * prediction.bbox[3]) /
              videoHeight * element.offsetHeight + element.offsetTop,
          target: element,
        }));
        Simulator.events.touch.trigger(touches, touches[0].target, 'end');
      } else if (predictions.length > 0) {
        touches = predictions.map(prediction => ({
          x: (prediction.bbox[0] + 0.5 * prediction.bbox[2]) /
              videoWidth * element.offsetWidth + element.offsetLeft,
          y: (prediction.bbox[1] + 0.5 * prediction.bbox[3]) /
              videoHeight * element.offsetHeight + element.offsetTop,
          target: element,
        }));
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
