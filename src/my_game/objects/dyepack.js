/* File: dyepack.js 
 *
 * Creates and initializes the DyePack object
 * overrides the update function of GameObject to define
 * simple DyePack behavior
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";
import Oscillate from "../../engine/utils/oscillate.js";


class DyePack extends engine.GameObject {
    constructor(spriteTexture, xPos = 0, yPos = 0, friendly = true) {
        super();
        this.mSpeed = 2;
        this.kDelta = 0.1;
        this.isFriendly = friendly;

        this.isHitAnimated = false;
        this.dyeOscillate = new Oscillate(4,20,300) //TODO: X-Amplitude of 4, 0.2?
        this.beforeHitSize = [0, 0];

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
        this.mPS = new engine.ParticleSet();
    }

    hit(objectType) { //objectType 0 = patrolBB, 1 = head, 2 = wing, 3 = hero
        let xform = this.getXform();
        let isDone = false;
        if(this.isFriendly) { //If the bullets are fired from the hero
            //Check if we hit the bounds of patrol, objectType 0, then slow down
            if (objectType === 0) {
                this.decreaseSpeedBy(this.kDelta);
            }
            //Check if we hit the a head or wing bounds, objectType 1/2, then check pixelTouches
            if (objectType === 1 || objectType === 2) {
                if(!this.isHitAnimated) { //Check if currently animated
                    this._OnStart(xform);
                }
            }
        } else { //Otherwise if the bullets are fired from enemies
            // TODO: if hit hero object then perform hit, no slow needed
            if (objectType === 3) {
                console.log("Checking");
                if(!this.isHitAnimated) { //Check if currently animated
                    this._OnStart(xform);
                }
            }
        }

        if (this.isHitAnimated) {
            xform.setPosition(this.beforeHitPos[0], this.beforeHitPos[1]);
            if(this.isFriendly) {
                xform.incXPosBy(this.dyeOscillate.getNext())
            } else {
                xform.incYPosBy(this.dyeOscillate.getNext())
            }
            isDone = this.dyeOscillate.done();
        }

        if(isDone) { //TODO: Redundant?
            this.isHitAnimated = false;
            this._OnDelete();
            //console.log("Despawned due to animation concluding");
        }
        return isDone;
    }

    NoteSet(set){
        this.set = set;
    }

    isHitAnimating() { return this.isHitAnimated; }

    isPlayerDye() { return this.isFriendly; }

    decreaseSpeedBy(delta) { this.mSpeed = this.mSpeed - delta; }

    update(aCamera) {
        let xForm = this.getXform();
        if(!this.isHitAnimated) {
            let par = new engine.Particle(engine.defaultResources.getDefaultPSTexture(),
                xForm.getXPos(), xForm.getYPos() , 50);
            par.setSize(1.5,1.5);
            par.setSizeDelta(0.98);
            par.setVelocity(20 * Math.random(),10+(20 * Math.random()));

            if(this.isFriendly) {
                xForm.setPosition(xForm.getXPos() + this.mSpeed, xForm.getYPos());
                par.setColor([0,1,0,1]);
                par.setFinalColor([1,1,1,.6]);
            } else {
                xForm.setPosition(xForm.getXPos() - this.mSpeed, xForm.getYPos());
                par.setColor([1,0,0 ,1]);
                par.setFinalColor([1,1,1,.6]);
                if (this.getBBox().boundCollideStatus(this.set.getObjectAt(0).getBBox()) > 0 &&
                    this.set.getObjectAt(0).isHitAnimating() == false 
                    && this.isHitAnimating() == false){
                    console.log("Player hit");
                    this.set.getObjectAt(0).hit(3);
                    this.hit(3,this);
                }
            }
            this.mPS.addToSet(par);

            if(this.mSpeed <= 0) {
                //console.log("Despawned due to lack of speed");
                this._OnDelete();
            }
    
            if(Date.now() >= this.timeOfDeletion) {
                //console.log("Despawned due to existing too long");
                this._OnDelete();
            }
        }
        this.mPS.update(aCamera); 
        
        if(this.isHitAnimated) {
            this.hit();
        }

        //Check to see if object has reached the edge of screen
        let rightBound = aCamera.getWCCenter()[0] + aCamera.getWCWidth()/2;
        let leftBound = aCamera.getWCCenter()[0] - aCamera.getWCWidth()/2
        if(xForm.getXPos() > rightBound || xForm.getXPos() < leftBound) {
            this._OnDelete();
            //console.log("Despawned due to world edge");
        }

        super.update();
    }

    _OnStart(xform) {
        this.beforeHitPos = [xform.getXPos(), xform.getYPos()];
        this.dyeOscillate.reStart();
        this.isHitAnimated = true;
    }

    _OnDelete(){
        this.set.removeFromSet(this);
        delete this;
    }
    draw(aCamera){
        super.draw(aCamera);
        this.mPS.draw(aCamera);
    }
}

export default DyePack;