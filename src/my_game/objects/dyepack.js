/* File: dyepack.js 
 *
 * Creates and initializes the DyePack object
 * overrides the update function of GameObject to define
 * simple DyePack behavior
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";


class DyePack extends engine.GameObject {
    constructor(spriteTexture, xPos = 0, yPos = 0, friendly = true) {
        super();
        this.mSpeed = 2;
        this.kDelta = 0.1;
        this.isFriendly = friendly;

        this.isHitAnimated = false;
        this.timeOfDeletion = Date.now() + 5000; 

        this.mRenderComponent = new engine.SpriteRenderable(spriteTexture);
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(xPos, yPos);
        this.mRenderComponent.getXform().setSize(2, 3.25);
        this.mRenderComponent.getXform().setRotationInDegree(90);
        if(this.isFriendly) {
            this.mRenderComponent.setElementPixelPositions(500, 600, 0, 180);
        } else {
            this.mRenderComponent.setElementPixelPositions(730, 830, 0, 180);
        }
        
        let r = new engine.RigidRectangle(this.getXform(), 2, 3.25);
        this.setRigidBody(r);
        this.toggleDrawRenderable();
        //this.toggleDrawRigidShape();
    }

    hit(objectHit) {
        //TODO: DO SOMETHING
        if(this.isFriendly) {
            if (objectHit === 0) {
                this.decreaseSpeedBy(this.kDelta);
            }
            
            if (objectHit === 1 || objectHit === 2) {
                //console.log("Dyepack has been hit!");
                this.isHitAnimated = true;
                //Terminate after hit
            }
        } else {
            // if hit hero object then perform hit, no slow needed
            if (objectHit === 3) {
                //???
            }
        }
    }

    NoteSet(set){
        this.set = set;
    }

    isHitAnimating() { return this.isHitAnimated; }

    isPlayerDye() { return this.isFriendly; }

    decreaseSpeedBy(delta) { this.mSpeed = this.mSpeed - delta; }

    update(aCamera) {
        let xForm = this.getXform();
        //Set default movement 
        //TODO: need to implement checks for other objects...?
        if(!this.isHitAnimated) {
            if(this.isFriendly) {
                xForm.setPosition(xForm.getXPos() + this.mSpeed, xForm.getYPos());
            } else {
                xForm.setPosition(xForm.getXPos() - this.mSpeed, xForm.getYPos());
            }

            if(this.mSpeed <= 0) {
                //console.log("Despawned due to lack of speed");
                this.OnDelete();
            }
    
            if(Date.now() >= this.timeOfDeletion) {
                //console.log("Despawned due to existing too long");
                this.OnDelete();
            }
        }
        
        if(this.isHitAnimated) {
            this.hit();
        }

        //Check to see if object has reached the edge of screen
        let rightBound = aCamera.getWCCenter()[0] + aCamera.getWCWidth()/2;
        let leftBound = aCamera.getWCCenter()[0] - aCamera.getWCWidth()/2
        if(xForm.getXPos() > rightBound || xForm.getXPos() < leftBound) {
            this.OnDelete();
            //console.log("Despawned due to world edge");
        }
    }

    OnDelete(){
        this.set.removeFromSet(this);
        delete this;
    }
}

export default DyePack;