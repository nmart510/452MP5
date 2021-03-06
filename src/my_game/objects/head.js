/* File: hero.js 
 *
 * Creates and initializes the Hero (Dye)
 * overrides the update function of GameObject to define
 * simple Dye behavior
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";
import Renderable from "../../engine/renderables/renderable.js";
import Score from "../objects/score.js";
import Wing from "../objects/wing.js";
import DyePack from "../objects/dyepack.js";

class Head extends engine.GameObject {
    constructor(spriteTexture, xPos = 50, yPos = 50, score) {
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
        this.tex = spriteTexture;
        this.mScore = score;
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
        this.mPatrol.setRigidBody(this.mPatrolBox);
        //this.mPatrol.toggleDrawRigidShape();
        this.mPatrol.toggleDrawRenderable();
        this.mW1 = new Wing(spriteTexture, xPos+10, yPos+6, this, true);
        this.mW2 = new Wing(spriteTexture, xPos+10, yPos-6, this, false);
        this.set = null;
        this.other = null;
        this.cooldown = Date.now();
        this.mPS = new engine.ParticleSet();
    }
    NoteSet(set,other){
        this.set = set;
        this.other = other;
    }
    hit(hitPosition = this.getXform().getPosition()){
        //particle emitter
        for (let i = 0; i < 20; i++){
            let par = new engine.Particle(engine.defaultResources.getDefaultPSTexture(),
                hitPosition[0]+5, hitPosition[1], 500);
            par.setColor([0,1,1,1]);
            par.setFinalColor([0,0,1,.6]);
            par.setSize(1.5,1.5);
            par.setSizeDelta(0.98);
            par.setVelocity(10 * Math.random(),10+(10 * Math.random()));
            this.mPS.addToSet(par);
        }

        this.mRenderComponent.getXform().setPosition(
            this.mRenderComponent.getXform().getXPos() + 5, 
            this.mRenderComponent.getXform().getYPos());
    }
    ToggleBox(){
        this.toggleDrawRigidShape();
        this.mW1.toggleDrawRigidShape();
        this.mW2.toggleDrawRigidShape();
        this.mPatrol.toggleDrawRigidShape();
    }
    update(aCamera){
        let xl = this.mRenderComponent.getXform().getXPos() - (this.mRenderComponent.getXform().getWidth()/2);
        let xr = this.mW1.getXform().getXPos() > this.mW1.getXform().getXPos()? (this.mW1.getXform().getXPos() + (this.mW1.getXform().getWidth()/2)):(this.mW2.getXform().getXPos() + (this.mW2.getXform().getWidth()/2));
        let yb = this.mW2.getXform().getYPos() - this.mW2.getXform().getHeight()/2;
        let yt = this.mW1.getXform().getYPos() + this.mW1.getXform().getHeight()/2;
        let x = xl + (xr-xl)/2;
        let y = yb + ((yt-yb)*1.5)/2;
        this.mPXform.setPosition(x,y);
        this.mPXform.setSize(xr-xl,(yt-yb)*1.5);
        this.mPatrolBox.setShapeSizeTo(xr-xl,(yt-yb)*1.5);
        for (let i = 0; i < this.other.size(); i++){
            //Check to see if patrol bounding box collides with another object
            if (this.mPatrol.getBBox().boundCollideStatus(this.other.getObjectAt(i).getBBox()) > 0){
                if (this.other.getObjectAt(i).isHitAnimating() == false) {
                    this.other.getObjectAt(i).hit(0);
                }
                let positionOfHit = [];
                //Then see if that same object then collides with the head object
                if (this.getBBox().boundCollideStatus(this.other.getObjectAt(i).getBBox()) > 0){
                    if (this.other.getObjectAt(i).isHitAnimating() == false){
                        if (i > 0 && this.other.getObjectAt(i).isPlayerDye()) {
                            if(this.other.getObjectAt(i).pixelTouches(this,positionOfHit)) {
                                this.hit(positionOfHit);
                                this.other.getObjectAt(i).hit(1);
                            }
                        } else {
                            this.other.getObjectAt(i).hit(1); 
                        }
                    }
                }
                //Then see if that same object then collides with the upper wing object
                if (this.mW1.getBBox().boundCollideStatus(this.other.getObjectAt(i).getBBox()) > 0){
                    if (this.other.getObjectAt(i).isHitAnimating() == false){
                        if (i > 0 && this.other.getObjectAt(i).isPlayerDye()) {
                            if(this.other.getObjectAt(i).pixelTouches(this.mW1, positionOfHit)) {
                                this.mW1.hit(positionOfHit);
                                this.other.getObjectAt(i).hit(2); 
                            }
                        } else {
                            this.other.getObjectAt(i).hit(2); 
                        }
                    }
                }
                //Then see if that same object then collides with the lower wing object
                if (this.mW2.getBBox().boundCollideStatus(this.other.getObjectAt(i).getBBox()) > 0){
                    if (this.other.getObjectAt(i).isHitAnimating() == false){
                        if (i > 0 && this.other.getObjectAt(i).isPlayerDye()) {
                            if(this.other.getObjectAt(i).pixelTouches(this.mW2, positionOfHit)) {
                                this.mW2.hit(positionOfHit);
                                this.other.getObjectAt(i).hit(2); 
                            }
                        } else {
                            this.other.getObjectAt(i).hit(2); 
                        }
                    }
                }
            }
        }
        switch(aCamera.collideWCBound(this.mPatrol.getXform(),1)){
            case 0: this.onDelete();
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
        if (this.other.getObjectAt(0).getXform().getXPos()+10 < this.getXform().getXPos() 
            && this.other.getObjectAt(0).getXform().getYPos()-2 < this.getXform().getYPos()
            && this.other.getObjectAt(0).getXform().getYPos()+2 > this.getXform().getYPos()){
            if (Date.now() > this.cooldown && this.other.getObjectAt(0).isHitAnimating() === false){
                let projectile = new DyePack(this.tex, this.getXform().getXPos()-4, this.getXform().getYPos(), false);
                projectile.toggleDrawRenderable();
                this.other.addToSet(projectile); 
                projectile.NoteSet(this.other);
                this.cooldown = 1000 + Date.now();
            }
        }

        if (this.mW1 != null)   
        this.mW1.update(aCamera);
        if (this.mW2 != null)
        this.mW2.update(aCamera);
        this.mPS.update(aCamera);
        super.update();
    }
    draw(aCamera){
        this.mW1.draw(aCamera);
        this.mW2.draw(aCamera);
        this.mPatrol.draw(aCamera);
        super.draw(aCamera);
        this.mPS.draw(aCamera);
    }
    onDelete(){
        this.mScore.increaseScoreBy(5);
        this.set.removeFromSet(this);
        delete this.mPatrol;
        delete this.mW1;
        delete this.mW2;
        delete this;
    }
}

export default Head;