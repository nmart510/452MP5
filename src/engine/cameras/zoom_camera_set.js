"use strict";
import GameObjectSet from "../game_objects/game_object_set.js";
import ZoomCamera from "./zoom_camera.js";


class ZoomCameraSet extends GameObjectSet {
    constructor() {
        super();
        this.mCameraSet = [];
    }
    //initially add the cameras all at once
    addCamera(camera1, camera2, camera3, camera4) {
        this.mCameraSet.push(camera1, camera2, camera3, camera4);
    }
    //add a new camera
    addNewCamera(wcCenter, wcWidth, viewportArr, bound) {
        let c = new ZoomCamera(wcCenter, wcWidth, viewportArr, bound);
        this.mCameraSet.push(c);
    }
    //add am existing camera
    addCameraAt(camera, index) {
        this.mCameraArray[index] = camera;
    }
    removeCameraAt(index) {
        this.mCameraArray.splice(index, 1);
    }
    setCameraMatrix() {
        for(let i = 0; i < this.mCameraSet.length; i++) {
            this.mCameraSet[i].setViewAndCameraMatrix();
        }
    }
}
export default ZoomCameraSet;