/* File: hero.js 
 *
 * Creates and initializes the Hero (Dye)
 * overrides the update function of GameObject to define
 * simple Dye behavior
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";
import LerpVec2 from "../../engine/utils/lerp_vec2.js";
import Oscillate from "../../engine/utils/oscillate.js";

class Hero extends engine.GameObject {
    constructor(spriteTexture) {
        super(null);
        this.kDelta = 0.05;

        this.isHitAnimated = false;
        this.heroOscillateX = new Oscillate(4.5, 4, 60);
        this.heroOscillateY = new Oscillate(6, 4, 60);
        this.beforeHitSize = [0, 0];
        
        this.heroDeaths = 0;

        this.mRenderComponent = new engine.SpriteRenderable(spriteTexture);
        this.mRenderComponent.setColor([.67,.43,1,0]);
        this.mRenderComponent.getXform().setPosition(50, 50);
        this.mRenderComponent.getXform().setSize(9, 12);
        this.mRenderComponent.setElementPixelPositions(0, 120, 0, 180);

        this.lerp = new LerpVec2(this.mRenderComponent.getXform().getPosition(), 120, this.kDelta);

        let r = new engine.RigidRectangle(this.getXform(), 9, 12);
        this.setRigidBody(r);
        this.respawn = Date.now();
        this.mPS = new engine.ParticleSet();
        
    }

    mouseControl(mouseX, mouseY) {
        this.lerp.setFinal([mouseX, mouseY])
    }

    hit(objectHit = 1) { // If no object is specified presume we hit a head object
        if(!this.isHitAnimated && (objectHit == 1 || objectHit == 3)){
            for (let i = 0; i < 20; i++){
                    let par = new engine.Particle(engine.defaultResources.getDefaultPSTexture(),
                        this.getXform().getXPos(), this.getXform().getYPos(), 500);
                    par.setColor([.67,.43,1,1]);
                    par.setFinalColor([.55,0,.7,.6]);
                    par.setSize(1.5,1.5);
                    par.setSizeDelta(0.98);
                    par.setVelocity(20 * (Math.random() - .5),10+(20 * (Math.random() - .5)));
                    this.mPS.addToSet(par);
                }
        }

        let xform = this.getXform();
        let isDone = false;
        if(objectHit == 1 || objectHit == 3) { //If and only if we hit the head object or enemy bullet
            if(!this.isHitAnimated) {
                this.mRenderComponent.setColor([.67,.43,1, this.mRenderComponent.getColor()[3] +.1]);
                this.beforeHitSize = [xform.getSize()[0], xform.getSize()[1]];
                this.heroOscillateX.reStart();
                this.heroOscillateY.reStart();
                this.isHitAnimated = true;
            }
        }
        
        if (this.isHitAnimated) {
            xform.setSize(this.beforeHitSize[0], this.beforeHitSize[1]);
            xform.incWidthBy(this.heroOscillateX.getNext())
            xform.incHeightBy(this.heroOscillateY.getNext())
            isDone = this.heroOscillateX.done();
        }

        if(this.mRenderComponent.getColor()[3] >= 1){
            this.respawn = Date.now() + 2000;
            this.mRenderComponent.setColor([.67,.43,1,0]);
            for (let i = 0; i < 80; i++){
                let par = new engine.Particle(engine.defaultResources.getDefaultPSTexture(),
                    this.getXform().getXPos(), this.getXform().getYPos(), 500);
                par.setColor([.67,.43,1,1]);
                par.setFinalColor([.55,0,.7,.6]);
                par.setSize(1.5,1.5);
                par.setSizeDelta(0.98);
                par.setVelocity(60 * (Math.random() - .5),20+(60 * (Math.random() - .5)));
                this.mPS.addToSet(par);
            }
            this.setVisibility(false);
            this.heroDeaths--;
        }
        if(this.respawn > Date.now()){
            isDone = false;
        }

        if(isDone) { //TODO: Redundant?
            if (this.isVisible() == false)
                this.setVisibility(true);
            this.isHitAnimated = false;
            xform.setSize(this.beforeHitSize[0], this.beforeHitSize[1]);
            //console.log("End");
        }
        return isDone;
    }

    isHitAnimating() { return this.isHitAnimated; }

    getHeroDeaths() { return this.heroDeaths; }

    update() {
        if(this.isHitAnimated) {
            this.hit();
        }
        this.lerp.update();
        let xform = this.getXform();
        let newPosition = this.lerp.get();
        xform.setPosition(newPosition[0], newPosition[1]);
        this.mPS.update();
        super.update();
    }
    draw(aCamera){
        super.draw(aCamera);
        this.mPS.draw(aCamera);
    }
}

export default Hero;