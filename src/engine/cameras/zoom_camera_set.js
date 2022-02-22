"use strict";
import GameObjectSet from "../game_objects/game_object_set.js";
import ZoomCamera from "./zoom_camera.js";


class ZoomCameraSet extends GameObjectSet {
    constructor() {
        super();
        this.mCameraSet = [];
    }
    addCamera(camera1, camera2, camera3, camera4) {
        this.mCameraSet.push(camera1, camera2, camera3, camera4);
    }
    //add a new camera
    addNewCamera(camera) {
        this.mCameraSet.push(camera);
    }
    //add am existing camera
    addCameraAt(camera, index) {
        this.mCameraSet[index] = camera;
    }
    removeCameraAt(index) {
        this.mCameraSet.splice(index, 1);
    }
    getCameraIndex(camera) {
        return this.mCameraSet.indexOf(camera);
    }
    setCameraMatrix() {
        for(let i = 0; i < this.mCameraSet.length; i++) {
            if(this.mCameraSet[i] !== null)
                this.mCameraSet[i].setViewAndCameraMatrix();
        }
    }
}
export default ZoomCameraSet;