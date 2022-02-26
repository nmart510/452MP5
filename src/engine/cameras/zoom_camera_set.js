"use strict";
import GameObjectSet from "../game_objects/game_object_set.js";


class ZoomCameraSet extends GameObjectSet {
    constructor() {
        super();
        this.mCameraSet = [];
    }
    //add a new camera
    addNewCamera(camera) {
        this.mCameraSet.push(camera);
    }
    //add an existing camera
    addCameraAt(camera, index) {
        this.mCameraSet[index] = camera;
    }
    removeCameraAt(index) {
        this.mCameraSet.splice(index, 1);
    }
    getCameraIndex(camera) {
        return this.mCameraSet.indexOf(camera);
    }
    setCameraMatrix(index) {
        this.mCameraSet[index].setViewAndCameraMatrix();
    }
    setWasForced(wasForced, index) {
        this.mCameraSet[index].setForcedVisible(wasForced);
    }
    getWasForced(index) {
        return this.mCameraSet[index].getForcedVisible();
    }
}
export default ZoomCameraSet;