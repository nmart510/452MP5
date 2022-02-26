/*
 * File: MyGame.js 
 *       This is the logic of our game. 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";
import Hero from "./objects/hero.js";
import Head from "./objects/head.js";
import Minion from "./objects/minion.js";
import DyePack from "./objects/dyepack.js";

//THIS IS A TEST
class MyGame extends engine.Scene {
    constructor() {
        super();
        this.kMinionSprite = "assets/minion_sprite.png";
        this.kPlatformTexture = "assets/platform.png"; //Remove?
        this.kWallTexture = "assets/wall.png"; //Remove?
        this.kTargetTexture = "assets/target.png"; //Remove?
        this.kBg = "assets/background.png";

        // The camera to view the scene
        this.mCamera = null;
        this.mCameraSet = null;
        this.mHeroCam = null;
        this.mSmallCam1 = null;
        this.mSmallCam2 = null;
        this.mSmallCam3 = null;

        this.mMsg = null;
        this.mShapeMsg = null;

        this.mBg = null;

        this.mPatrols = [];
        this.mPatrolNum = 5;
        this.mPlatforms = null;
        this.mBounds = null;
        this.mCollisionInfos = [];
        this.mHero = null;
        this.mHead = null;
        this.mTop = null;
        this.mBottom = null;

        this.mCurrentObj = 0;
        this.mTarget = null;

        // Draw controls
        this.mDrawCollisionInfo = false;
        this.mDrawTexture = false;
        this.mDrawBounds = false;
        this.mDrawRigidShape = true;

        // Particle Support
        this.mParticles = null;
        this.mPSDrawBounds = false;
        this.mPSCollision = true;
    }



    load() {
        engine.texture.load(this.kMinionSprite);
        engine.texture.load(this.kPlatformTexture);
        engine.texture.load(this.kWallTexture);
        engine.texture.load(this.kTargetTexture);
        engine.texture.load(this.kBg);
    }

    unload() {
        engine.texture.unload(this.kMinionSprite);
        engine.texture.unload(this.kPlatformTexture);
        engine.texture.unload(this.kWallTexture);
        engine.texture.unload(this.kTargetTexture);
        engine.texture.load(this.kBg);
    }

    init() {
        // Step A: set up the cameras
        this.mCamera = new engine.Camera(
            vec2.fromValues(100, 75), // position of the camera
            200,                     // width of camera
            [0, 0, 800, 600]         // viewport (orgX, orgY, width, height)
        );

        //background
        this.mBg = new engine.TextureRenderable(this.kBg);
        this.mBg.getXform().setSize(200, 200);
        this.mBg.getXform().setPosition(100, 75);

        //smaller viewports
        this.mCameraSet = new engine.ZoomCameraSet();

        //small viewports
        this.mHeroCam = new engine.ZoomCamera(
            vec2.fromValues(50,40),
            15,
            [0,600,200,200]
        );
        //the first dye pack camera
        this.smallCam1 = new engine.ZoomCamera(
            vec2.fromValues(50,40),
            6,
            [200,600,200,200]
        );
        this.smallCam2 = new engine.ZoomCamera(
            vec2.fromValues(50,40),
            6,
            [400,600,200,200]
        );
        this.smallCam3 = new engine.ZoomCamera(
            vec2.fromValues(50,40),
            6,
            [600,600,200,200]
        );
        
        this.mHeroCam.setBackgroundColor([0,0,0,1]);
        this.smallCam1.setBackgroundColor([1,1,1,1]);
        this.smallCam2.setBackgroundColor([0,0,0,1]);
        this.smallCam3.setBackgroundColor([1,1,1,1]);

        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
        // sets the background to gray
        engine.defaultResources.setGlobalAmbientIntensity(3);

        this.mAllObjs = new engine.GameObjectSet();
        this.mPlatforms = new engine.GameObjectSet();
        this.mPatrols = new engine.GameObjectSet();

        this.createBounds();  // added to mPlatforms

        this.mHero = new Hero(this.kMinionSprite);
        //this.mHero.toggleDrawRenderable(); //Seems to break the renderable
        this.mAllObjs.addToSet(this.mHero);
        this.mCurrentObj = 0;
                
        // particle systems
        this.mParticles = new engine.ParticleSet();

        for (let i = 0; i < this.mPatrolNum; i++) {
            let x = 10 + Math.random()*170;
            let y = 15 + Math.random()*110;
            let h = new Head(this.kMinionSprite, x, y);
            this.mPatrols.addToSet(h);
            h.NoteSet(this.mPatrols);
        }

        this.mMsg = new engine.FontRenderable("Status Message");
        this.mMsg.setColor([0, 0, 0, 1]);
        this.mMsg.getXform().setPosition(5, 7);
        this.mMsg.setTextHeight(3);

        this.mShapeMsg = new engine.FontRenderable("Shape");
        this.mShapeMsg.setColor([0, 0, 0, 1]);
        this.mShapeMsg.getXform().setPosition(5, 73);
        this.mShapeMsg.setTextHeight(2.5);

    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        this.mCamera.setViewAndCameraMatrix();
        this.mBg.draw(this.mCamera);
        //this.mPlatforms.draw(this.mCamera);
        this.mAllObjs.draw(this.mCamera);
        this.mPatrols.draw(this.mCamera);

        this.mParticles.draw(this.mCamera);
        if (this.mPSDrawBounds)
            this.mParticles.drawMarkers(this.mCamera);

        // for now draw these ...
        if (this.mCollisionInfos !== null) {
        for (let i = 0; i < this.mCollisionInfos.length; i++)
            this.mCollisionInfos[i].draw(this.mCamera);
        this.mCollisionInfos = [];
        }

        //this.mTarget.draw(this.mCamera);
        //this.mMsg.draw(this.mCamera);   
        //this.mShapeMsg.draw(this.mCamera);

        //set the camera matrix and draw to it after this.
        this.mCameraSet.setCameraMatrix();

        this.mBg.draw(this.mHeroCam);
        this.mAllObjs.draw(this.mHeroCam);
        
        if(this.smallCam1 !== null) {
            this.mBg.draw(this.smallCam1);
            this.mAllObjs.draw(this.smallCam1);
        }
        
        if(this.smallCam2 !== null) {
            this.mBg.draw(this.smallCam2);
            this.mAllObjs.draw(this.smallCam2);
        }
        if(this.mSmallCam3 !== null) {
            this.mBg.draw(this.smallCam3);
            this.mAllObjs.draw(this.smallCam3);
        }
    }

    incShapeSize(obj, delta) {
        let s = obj.getRigidBody();
        let r = s.incShapeSizeBy(delta);
    }

    // The Update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        let msg = "";
        let kBoundDelta = 0.1;

        this.mAllObjs.update(this.mCamera);
        //this.mPlatforms.update(this.mCamera);
        this.mPatrols.update(this.mCamera);

        if (engine.input.isKeyClicked(engine.input.keys.P)) {
            engine.physics.togglePositionalCorrection();
        }
        if (engine.input.isKeyClicked(engine.input.keys.V)) {
            engine.physics.toggleHasMotion();
        }
        if (engine.input.isKeyClicked(engine.input.keys.H)) {
            this.randomizeVelocity();
        }

        if (engine.input.isKeyClicked(engine.input.keys.Left)) {
            this.mCurrentObj -= 1;
            if (this.mCurrentObj < 0)
                this.mCurrentObj = this.mAllObjs.size() - 1;
        }
        if (engine.input.isKeyClicked(engine.input.keys.Right)) {
            this.mCurrentObj += 1;
            if (this.mCurrentObj >= this.mAllObjs.size())
                this.mCurrentObj = 0;
        }

        //viewport manipulation
        //hero cam
        if (engine.input.isKeyClicked(engine.input.keys.Zero)) {
            let index = this.mCameraSet.getCameraIndex(this.mHeroCam);
            if(index !== -1) {
                this.mCameraSet.removeCameraAt(index);  
            }
            else {
                this.mCameraSet.addNewCamera(this.mHeroCam);
            }
        }
        //dye pack cameras
        if (engine.input.isKeyClicked(engine.input.keys.One)) {
            let index = this.mCameraSet.getCameraIndex(this.smallCam1);
            if(index !== -1) {
                this.mCameraSet.removeCameraAt(index);  
            }
            else {
                this.mCameraSet.addNewCamera(this.smallCam1);
            }
        }
        if (engine.input.isKeyClicked(engine.input.keys.Two)) {
            let index = this.mCameraSet.getCameraIndex(this.smallCam2);
            if(index !== -1) {
                this.mCameraSet.removeCameraAt(index);  
            }
            else {
                this.mCameraSet.addNewCamera(this.smallCam2);
            }
        }
        if (engine.input.isKeyClicked(engine.input.keys.Three)) {
            let index = this.mCameraSet.getCameraIndex(this.smallCam3);
            if(index !== -1) {
                this.mCameraSet.removeCameraAt(index);  
            }
            else {
                this.mCameraSet.addNewCamera(this.smallCam3);
            }
        }

        let obj = this.mAllObjs.getObjectAt(this.mCurrentObj);
        if (engine.input.isKeyPressed(engine.input.keys.Y)) {
            this.incShapeSize(obj, kBoundDelta);
        }
        if (engine.input.isKeyPressed(engine.input.keys.U)) {
            this.incShapeSize(obj, -kBoundDelta);
        }

        if (engine.input.isKeyClicked(engine.input.keys.C)) {
            let x = 10 + Math.random()*170;
            let y = 15 + Math.random()*110;
            let m = new Head(this.kMinionSprite, x, y);
            if (this.mDrawTexture) // default is false
                m.toggleDrawRenderable();
            if (this.mDrawBounds) // default is false
                m.getRigidBody().toggleDrawBound();
            if (!this.mDrawRigidShape) // default is true
                m.toggleDrawRigidShape();
            this.mPatrols.addToSet(m);
        }
        
        // Hero Movement System
        let hero = this.mAllObjs.getObjectAt(0); // Hero should always be first object loaded
        if (this.mCamera.isMouseInViewport()) {
            hero.mouseControl(this.mCamera.mouseWCX(), this.mCamera.mouseWCY());   
        }
        if(engine.input.isKeyClicked(engine.input.keys.Q)) {
            hero.hit();
        }

        hero.update(); //Used to cycle through hero updates 

        // Spawn in DyePack projectiles
        if(engine.input.isKeyClicked(engine.input.keys.Space)) {
            let heroXForm = hero.getXform();
            let projectile = new DyePack(this.kMinionSprite, heroXForm.getXPos()+5, heroXForm.getYPos()+4, true);
            projectile.toggleDrawRenderable();
            this.mAllObjs.addToSet(projectile); 
        }

        
        // Particle System
        this.mParticles.update();
        if (engine.input.isKeyClicked(engine.input.keys.E))
            this.mPSDrawBounds = !this.mPSDrawBounds;
        if (engine.input.isKeyPressed(engine.input.keys.Q)) {
            if (this.mCamera.isMouseInViewport()) {
                let par = _createParticle(this.mCamera.mouseWCX(), this.mCamera.mouseWCY());
                this.mParticles.addToSet(par);
            }
        }

        /*if (engine.input.isKeyClicked(engine.input.keys.One))
            this.mPSCollision = !this.mPSCollision;
        if (this.mPSCollision) {
            engine.particleSystem.resolveRigidShapeSetCollision(this.mAllObjs, this.mParticles);
            engine.particleSystem.resolveRigidShapeSetCollision(this.mPlatforms, this.mParticles);
        }*/

        this.drawControlUpdate();

        if (this.mDrawCollisionInfo)
            this.mCollisionInfos = [];
        else
            this.mCollisionInfos = null;
        engine.physics.processObjToSet(this.mHero, this.mPlatforms, this.mCollisionInfos);
        engine.physics.processSetToSet(this.mAllObjs, this.mPlatforms, this.mCollisionInfos);
        engine.physics.processSet(this.mAllObjs, this.mCollisionInfos);

        let p = obj.getXform().getPosition();
        this.mTarget.getXform().setPosition(p[0], p[1]);
        msg += "  P(" + engine.physics.getPositionalCorrection() +
            " " + engine.physics.getRelaxationCount() + ")" +
            " V(" + engine.physics.getHasMotion() + ")";
        this.mMsg.setText(msg);

        this.mShapeMsg.setText(obj.getRigidBody().getCurrentState());

        this.mHeroCam.update();
        this.smallCam1.update();
        this.smallCam2.update();
        this.smallCam3.update();
        this.mHeroCam.panTo(this.mHero.getXform().getXPos(), this.mHero.getXform().getYPos());
    }

    drawControlUpdate() {
        let i;
        if (engine.input.isKeyClicked(engine.input.keys.C)) {
            this.mDrawCollisionInfo = !this.mDrawCollisionInfo;
        }
        if (engine.input.isKeyClicked(engine.input.keys.T)) {
            this.mDrawTexture = !this.mDrawTexture;
            this.mAllObjs.toggleDrawRenderable();
            //this.mPlatforms.toggleDrawRenderable();
        }
        if (engine.input.isKeyClicked(engine.input.keys.R)) {
            this.mDrawRigidShape = !this.mDrawRigidShape;
            this.mAllObjs.toggleDrawRigidShape();
            //this.mPlatforms.toggleDrawRigidShape();
        }
        if (engine.input.isKeyClicked(engine.input.keys.B)) {
            this.mDrawBounds = !this.mDrawBounds;
            this.mAllObjs.toggleDrawBound();
            //this.mPlatforms.toggleDrawBound();
        }
    }
}

let kSpeed = 40;
MyGame.prototype.randomizeVelocity = function()
{
    let i = 0;
    for (i = 0; i<this.mAllObjs.size(); i++) {
        let obj = this.mAllObjs.getObjectAt(i);
        let rigidShape = obj.getRigidBody();
        let x = (Math.random() - 0.5) * kSpeed;
        let y = Math.random() * kSpeed * 0.5;
        rigidShape.setVelocity(x, y);
        let c = rigidShape.getCenter();
        this.mParticles.addEmitterAt(c[0], c[1], 20, _createParticle);
    }
}

function _createParticle(atX, atY) {
    let life = 30 + Math.random() * 200;
    let p = new engine.Particle(engine.defaultResources.getDefaultPSTexture(), atX, atY, life);
    p.setColor([1, 0, 0, 1]);
    
    // size of the particle
    let r = 5.5 + Math.random() * 0.5;
    p.setSize(r, r);
    
    // final color
    let fr = 3.5 + Math.random();
    let fg = 0.4 + 0.1 * Math.random();
    let fb = 0.3 + 0.1 * Math.random();
    p.setFinalColor([fr, fg, fb, 0.6]);
    
    // velocity on the particle
    let fx = 10 - 20 * Math.random();
    let fy = 10 * Math.random();
    p.setVelocity(fx, fy);
    
    // size delta
    p.setSizeDelta(0.98);
    
    return p;
}
export default MyGame;