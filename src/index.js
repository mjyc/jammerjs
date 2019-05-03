import * as handTrack from 'handtrackjs';
// import * as handTrack from '../node_modules/handtrackjs/dist/handtrack.min.js';  // for standalone
import 'hammer-simulator';


const start = async (element, video, canvas, {
  model = null,
  modelParams = {},
  transform = (prediction, video, target) => ({
    x: (prediction.bbox[0] + 0.5 * prediction.bbox[2]) /
        video.width * target.offsetWidth + target.offsetLeft,
    y: (prediction.bbox[1] + 0.5 * prediction.bbox[3]) /
        video.height * target.offsetHeight + target.offsetTop,
    target: target,
  }),
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


  const context = canvas.getContext("2d");
  let lastPredictions = [];
  let touches = [];
  function runDetection() {
    model.detect(video).then(predictions => {
      model.renderPredictions(predictions, canvas, context, video);

      if (lastPredictions.length === 0 && predictions.length > 0) {
        touches = predictions.map(prediction =>
          transform(prediction, video, element));
        Simulator.events.touch.trigger(touches, touches[0].target, 'start');
      } else if (predictions.length === 0 && lastPredictions.length > 0) {
        touches = lastPredictions.map(prediction =>
          transform(prediction, video, element));
        Simulator.events.touch.trigger(touches, touches[0].target, 'end');
      } else if (predictions.length > 0) {
        touches = predictions.map(prediction =>
          transform(prediction, video, element));
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
