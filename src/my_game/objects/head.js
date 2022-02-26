/* File: hero.js 
 *
 * Creates and initializes the Hero (Dye)
 * overrides the update function of GameObject to define
 * simple Dye behavior
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import WASDObj from "./wasd_obj.js";
import engine from "../../engine/index.js";
import Renderable from "../../engine/renderables/renderable.js";
import Wing from "../objects/wing.js";



class Head extends WASDObj {
    constructor(spriteTexture, xPos = 50, yPos = 50) {
        super(null);
        this.kDelta = 0.3;
        this.mRenderComponent = new engine.SpriteRenderable(spriteTexture);
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(xPos, yPos);
        this.mRenderComponent.getXform().setSize(7.5, 7.5);
        this.mRenderComponent.setElementPixelPositions(134, 314, 0, 180);
        this.mPatrol = new engine.GameObject(new Renderable());
        this.mPXform = this.mPatrol.getXform();
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
        this.mW1 = new Wing(spriteTexture, xPos+10, yPos+6, this, true);
        this.mW2 = new Wing(spriteTexture, xPos+10, yPos-6, this, false);
        this.set = null;
    }
    NoteSet(set){
        this.set = set;
    }
    hit(){
        //particle emitter
        this.mRenderComponent.getXform().setPosition(
            this.mRenderComponent.getXform().getXPos() + 5, 
            this.mRenderComponent.getXform().getYPos());
    }
    update(aCamera){
        this.mW1.update(aCamera);
        this.mW2.update(aCamera);
        let xl = this.mRenderComponent.getXform().getXPos() - (this.mRenderComponent.getXform().getWidth()/2);
        let xr = this.mW1.getXform().getXPos() > this.mW1.getXform().getXPos()? (this.mW1.getXform().getXPos() + (this.mW1.getXform().getWidth()/2)):(this.mW2.getXform().getXPos() + (this.mW2.getXform().getWidth()/2));
        let yb = this.mW2.getXform().getYPos() - this.mW2.getXform().getHeight()/2;
        let yt = this.mW1.getXform().getYPos() + this.mW1.getXform().getHeight()/2;
        let x = xl + (xr-xl)/2;
        let y = yb + ((yt-yb)*1.5)/2;
        this.mPXform.setPosition(x,y);
        this.mPXform.setSize(xr-xl,(yt-yb)*1.5);
        this.mPatrolBox.setShapeSizeTo(xr-xl,(yt-yb)*1.5);
        switch(aCamera.collideWCBound(this.mPatrol.getXform(),1)){
            case 0: OnDelete();
            break;
            case 1: if (this.getRigidBody().getVelocity()[0] < 0)
                this.getRigidBody().setVelocity(-this.getRigidBody().getVelocity()[0],this.getRigidBody().getVelocity()[1]);
                break;
            case 2: if (this.getRigidBody().getVelocity()[0] > 0)
                this.getRigidBody().setVelocity(-this.getRigidBody().getVelocity()[0],this.getRigidBody().getVelocity()[1]);
                break;
            case 4: if (this.getRigidBody().getVelocity()[1] > 0)
                this.getRigidBody().setVelocity(this.getRigidBody().getVelocity()[0],-this.getRigidBody().getVelocity()[1]);
                break;
            case 8: if (this.getRigidBody().getVelocity()[1] < 0)
                this.getRigidBody().setVelocity(this.getRigidBody().getVelocity()[0],-this.getRigidBody().getVelocity()[1]);
                break;
            default: //anything else
        }
        super.update();
    }
    draw(aCamera){
        this.mW1.draw(aCamera);
        this.mW2.draw(aCamera);
        this.mPatrolBox.draw(aCamera);
        super.draw(aCamera);
    }
    OnDelete(){
        console.log("Patrol removed");
        this.set.removeFromSet(this);
        delete this.mW1;
        delete this.mW2;
        delete this;
    }
}

export default Head;