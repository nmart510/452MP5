/* File: hero.js 
 *
 * Creates and initializes the Hero (Dye)
 * overrides the update function of GameObject to define
 * simple Dye behavior
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";

class Hero extends engine.GameObject {
    constructor(spriteTexture) {
        super(null);
        this.kDelta = 0.3;
        this.mRenderComponent = new engine.SpriteRenderable(spriteTexture);
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(50, 50);
        this.mRenderComponent.getXform().setSize(9, 12);
        this.mRenderComponent.setElementPixelPositions(0, 120, 0, 180);

        let r = new engine.RigidRectangle(this.getXform(), 9, 12);
        this.setRigidBody(r);
        this.toggleDrawRenderable(); //TODO: This apparetly fixes the problem with hero?
        this.toggleDrawRigidShape();
    }

    mouseControl() {
        let xform = this.getXform();
        if (true) {
            console.log(engine.input.isButtonPressed(engine.input.eMouseButton.eLeft))
            console.log(engine.input.getMousePosX() + " / " + engine.input.getMousePosY());
        }
        /*
        if (engine.input.isKeyPressed(engine.input.keys.W)) {
            xform.incYPosBy(kWASDDelta);
        }
        if (engine.input.isKeyPressed(engine.input.keys.S)) {
            xform.incYPosBy(-kWASDDelta);
        }
        if (engine.input.isKeyPressed(engine.input.keys.A)) {
            xform.incXPosBy(-kWASDDelta);
        }
        if (engine.input.isKeyPressed(engine.input.keys.D)) {
            xform.incXPosBy(kWASDDelta);
        }
        if (engine.input.isKeyPressed(engine.input.keys.Z)) {
            xform.incRotationByDegree(1);
        }
        if (engine.input.isKeyPressed(engine.input.keys.X)) {
            xform.incRotationByDegree(-1);
        }
        this.getRigidBody().userSetsState();
        */
    }
}

export default Hero;