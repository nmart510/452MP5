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
        this.kDelta = 0.05;
        this.mRenderComponent = new engine.SpriteRenderable(spriteTexture);
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(50, 50);
        this.mRenderComponent.getXform().setSize(9, 12);
        this.mRenderComponent.setElementPixelPositions(0, 120, 0, 180);

        let r = new engine.RigidRectangle(this.getXform(), 9, 12);
        this.setRigidBody(r);
        this.toggleDrawRenderable
        //this.toggleDrawRigidShape();
    }

    mouseControl(mouseX, mouseY) {
        let xform = this.getXform();
        let position = xform.getPosition();
        let xDelta = (mouseX - position[0])*this.kDelta;
        let yDelta = (mouseY - position[1])*this.kDelta; 
        xform.setPosition(position[0] + xDelta, position[1] + yDelta);
        
        // ALTERNATE X-FORM based on w/o intrpolation?
        //let distance = Math.sqrt(Math.pow((position[0] - mouseX), 2) + Math.pow((position[1] - mouseY), 2));
        // Q: position[0], position[1]
        // P: mouseX, mouseY
        // N: position[0] + mouseX, position[1] - mouseY
        //let xDelta = this.kDelta * (position[0] - mouseX) / distance;
        //let yDelta = this.kDelta * (position[1] - mouseY) / distance; 
        //xform.setPosition(position[0] - xDelta, position[1] - yDelta);
    }

    hit() {
        //TODO: Insert animation here
        console.log("Hero has been hit!");
    }
}

export default Hero;