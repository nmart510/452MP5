/* File: hero.js 
 *
 * Creates and initializes the Hero (Dye)
 * overrides the update function of GameObject to define
 * simple Dye behavior
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import WASDObj from "./wasd_obj.js";
import engine from "../../engine/index.js";
import Transform from "../../engine/utils/transform.js";


class Head extends WASDObj {
    constructor(spriteTexture, xPos = 50, yPos = 50) {
        super(null);
        this.kDelta = 0.3;
        this.mRenderComponent = new engine.SpriteRenderable(spriteTexture);
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(xPos, yPos);
        this.mRenderComponent.getXform().setSize(7.5, 7.5);
        this.mRenderComponent.setElementPixelPositions(134, 314, 0, 180);
        this.mW1 = null;
        this.mW2 = null;
        this.mPXform = new Transform();
        this.mPatrolBox = new engine.RigidRectangle(this.mPXform, 10,10);

        let r = new engine.RigidRectangle(this.getXform(), 7.5, 7.5);
        let vx = Math.random() - 0.5;
        let vy = Math.random() - 0.5;
        //|v| = sqrt(vx^2+xy^2)
        //u = v/|v|
        let vDot = Math.sqrt(vx*vx + vy*vy);
        let u = vec2.fromValues(vx*(1/vDot),vy*(1/vDot));
        let speed = 5 + Math.random() * 5;
        r.setVelocity(u[0] * speed, u[1] * speed);
        this.setRigidBody(r);
        //this.toggleDrawRenderable();
        this.toggleDrawRigidShape();
    }
    
    setWings(w1, w2){
        this.mW1 = w1;
        this.mW2 = w2;
    }
    update(aCamera){
        let xl = this.mRenderComponent.getXform().getXPos() - (this.mRenderComponent.getXform().getWidth()/2);
        let xr = this.mW1.getXform().getXPos() > this.mW1.getXform().getXPos()? (this.mW1.getXform().getXPos() + (this.mW1.getXform().getWidth()/2)):(this.mW2.getXform().getXPos() + (this.mW2.getXform().getWidth()/2));
        let yb = this.mW2.getXform().getYPos() - this.mW2.getXform().getHeight()/2;
        let yt = this.mW1.getXform().getYPos() + this.mW1.getXform().getHeight()/2;
        let x = xl + (xr-xl)/2;
        let y = yb + ((yt-yb)*1.5)/2;
        this.mPXform.setPosition(x,y);
        this.mPatrolBox.setShapeSizeTo(xr-xl,(yt-yb)*1.5);
        super.update();
    }
    draw(aCamera){
        this.mPatrolBox.draw(aCamera);
        super.draw(aCamera);
    }
}

export default Head;