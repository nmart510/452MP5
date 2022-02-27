"use strict";
import Camera from "./camera_main.js";

class ZoomCamera extends Camera {
    constructor(wcCenter, wcWidth, viewportArray = [0,0,200,200], bound) {
        super(wcCenter, wcWidth, viewportArray, bound);
        this.wasForced = false;
        this.dyepack = null;
    }
    setFocus(obj) {
        this.setWCCenter(obj.getXform().getXPos(), obj.getXform().getYPos());
    }
    setDyepack(dyepack) { this.dyepack = dyepack; }
    getDyepack() { return this.dyepack; }
    setForcedVisible(wasForced) {
        this.wasForced = wasForced;
    }
    getForcedVisible() { 
        return this.wasForced; 
    }
} 
export default ZoomCamera;