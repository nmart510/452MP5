/* File: dyepack.js 
 *
 * Creates and initializes the DyePack object
 * overrides the update function of GameObject to define
 * simple DyePack behavior
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import WASDObj from "./wasd_obj.js";
import engine from "../../engine/index.js";


class DyePack extends WASDObj {
    constructor(spriteTexture, xPos = 50, yPos = 50) {
        super(null);
        this.kDelta = 0.3;
        this.mRenderComponent = new engine.SpriteRenderable(spriteTexture);
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(xPos, yPos);
        this.mRenderComponent.getXform().setSize(7.5, 7.5);
        this.mRenderComponent.setElementPixelPositions(134, 314, 0, 180);

        let r = new engine.RigidRectangle(this.getXform(), 7.5, 7.5);
        let vx = (Math.random() - 0.5);
        let vy = (Math.random() - 0.5);
        let speed = 5 + Math.random() * 5;
        r.setVelocity(vx * speed, vy * speed);
        this.setRigidBody(r);
        //this.toggleDrawRenderable();
        this.toggleDrawRigidShape();
    }
}

export default DyePack;