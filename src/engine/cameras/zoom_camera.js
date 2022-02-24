"use strict";
import Camera from "./camera_main.js";

class ZoomCamera extends Camera {
    constructor(wcCenter, wcWidth, viewportArray = [0,0,200,200], bound) {
        super(wcCenter, wcWidth, viewportArray, bound);
    }
}
export default ZoomCamera;