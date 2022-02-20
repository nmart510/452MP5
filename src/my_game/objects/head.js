/* File: hero.js 
 *
 * Creates and initializes the Hero (Dye)
 * overrides the update function of GameObject to define
 * simple Dye behavior
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import WASDObj from "./wasd_obj.js";
import engine from "../../engine/index.js";

class Head extends WASDObj {
    constructor(spriteTexture) {
        super(null);
        this.kDelta = 0.3;
        this.mRenderComponent = new engine.SpriteRenderable(spriteTexture);
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(50, 40);
        this.mRenderComponent.getXform().setSize(7.5, 7.5);
        this.mRenderComponent.setElementPixelPositions(156, 289, 0, 180);

        let r = new engine.RigidRectangle(this.getXform(), 7.5, 7.5);
        this.setRigidBody(r);
        this.toggleDrawRenderable();
        this.toggleDrawRigidShape();
    }
}

export default Head;