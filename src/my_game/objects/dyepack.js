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
        this.kSpeed = 2;
        this.isFriendly = friendly;

        this.isHitAnimated = false;

        this.set = null;

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
        if (objectHit === 0) {
              //slow speed
        }

        console.log("Dyepack has been hit!");
        if (objectHit == 1 || objectHit == 2)
            this.isHitAnimated = true;
        //Terminate after hit
    }

    NoteSet(set){
        this.set = set;
    }

    isHitAnimating() { return this.isHitAnimated; }

    isPlayerDye() { return this.isFriendly; }

    decreaseSpeedBy(delta) { this.kSpeed = this.kSpeed - delta; }

    update(aCamera) {
        let xForm = this.getXform();
        //Set default movement 
        //TODO: need to implement checks for other objects...?
        if(this.isFriendly) {
            xForm.setPosition(xForm.getXPos() + this.kSpeed, xForm.getYPos());
        } else {
            xForm.setPosition(xForm.getXPos() - this.kSpeed, xForm.getYPos());
        }
        

        //Check to see if object has reached the edge of screen
        //TODO: replace with aCamera.collideWCBound(this.mPatrol.getXform(),1) ???
        let rightBound = aCamera.getWCCenter()[0] + aCamera.getWCWidth()/2;
        let leftBound = aCamera.getWCCenter()[0] - aCamera.getWCWidth()/2
        if(xForm.getXPos() > rightBound || xForm.getXPos() < leftBound) {
            this.OnDelete();
            console.log("Despawned due to world edge");
        }

        /*
        if(this.kSpeed <= 0) {
            if(xForm.getSize()[0] > 0) {
                //TODO: Make sure projectile is fully deleted...
                console.log("Despawned due to lack of speed");
                this.toggleDrawRenderable();
                xForm.setSize(0,0);
            }
        }
        */
        //TODO: IF HIT PATROL OBJECT? 

        //Check to see of object has hit another object... call hit. 
    }

    OnDelete(){
        this.set.removeFromSet(this);
        delete this;
    }
}

export default DyePack;