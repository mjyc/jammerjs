import * as HandtrackTouch from 'jammerjs';
import Hammer from 'hammerjs';

const el = document.querySelector("#hit");
const log = document.querySelector("#log");
const debug = document.querySelector("#debug");

const mc = new Hammer(el, {inputClass: Hammer.TouchInput});
mc.get('pinch').set({ enable: true });

mc.on("hammer.input", function(ev) {
    debug.innerHTML = [ev.srcEvent.type, ev.pointers.length, ev.isFinal, ev.deltaX, ev.deltaY].join("<br>");
});


const video = document.getElementById("handtrackjs").getElementsByTagName("video")[0];
const canvas = document.getElementById("handtrackjs").getElementsByTagName("canvas")[0];
const context = canvas.getContext("2d");

HandtrackTouch.start(el, video, canvas);
