/*
 * File: MyGame.js 
 *       This is the logic of our game. 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";
import Hero from "./objects/hero.js";
import Head from "./objects/head.js";
import Score from "./objects/score.js";
import DyePack from "./objects/dyepack.js";

class MyGame extends engine.Scene {
    constructor() {
        super();
        this.kMinionSprite = "assets/minion_sprite.png";
        this.kMinionSprite2 = "assets/minion_sprite2.png";
        this.kBg = "assets/background.png";

        // The camera to view the scene
        this.mCamera = null;
        this.mCameraSet = null;
        this.mHeroCam = null;
        this.mSmallCam1 = null;
        this.mSmallCam2 = null;
        this.mSmallCam3 = null;

        // Status Display Messages
        this.mMsg = null;
        this.mDyepacksMsg = null;
        this.mPatrolsMsg = null;
        this.mScoreMsg = null;
        this.mScore = new Score();

        this.mOscillatingDyepacks = [];

        // Texture member variables for objects
        this.mBg = null;
        this.mHero = null;
        this.mHead = null;
        
        // Member variables for patrols
        this.mPatrols = [];
        this.mPatrolNum = 5;
        this.mPlatforms = null;
        this.autoSpawn = false;
        this.cooldown = Date.now();

        // Particle Support
        this.mParticles = null;
    }



    load() {
        engine.texture.load(this.kMinionSprite);
        engine.texture.load(this.kMinionSprite2);
        engine.texture.load(this.kBg);
    }

    unload() {
        engine.texture.unload(this.kMinionSprite);
        engine.texture.unload(this.kMinionSprite2);
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
        this.mPatrols = new engine.GameObjectSet(); 

        this.mHero = new Hero(this.kMinionSprite);
        this.mAllObjs.addToSet(this.mHero);
                
        // particle systems
        this.mParticles = new engine.ParticleSet();

        for (let i = 0; i < this.mPatrolNum; i++) {
            let x = 100 + Math.random()*95;
            let y = 37 + Math.random()*75;
            let sprite = (Math.random()-.5) < 0? this.kMinionSprite : this.kMinionSprite2;
            let h = new Head(sprite, x, y, this.mScore);
            this.mPatrols.addToSet(h);
            h.NoteSet(this.mPatrols, this.mAllObjs);
        }

        this.mMsg = new engine.FontRenderable("auto spawn mode");
        this.mMsg.setColor([1, 1, 1, 1]);
        this.mMsg.getXform().setPosition(5, 7);
        this.mMsg.setTextHeight(3);

        this.mPatrolsMsg = new engine.FontRenderable("num patrols");
        this.mPatrolsMsg.setColor([1, 1, 1, 1]);
        this.mPatrolsMsg.getXform().setPosition(55, 7);
        this.mPatrolsMsg.setTextHeight(3);

        this.mDyepackMsg = new engine.FontRenderable("num dyepacks");
        this.mDyepackMsg.setColor([1, 1, 1, 1]);
        this.mDyepackMsg.getXform().setPosition(100, 7);
        this.mDyepackMsg.setTextHeight(3);

        this.mScoreMsg = new engine.FontRenderable("score");
        this.mScoreMsg.setColor([1, 1, 1, 1]);
        this.mScoreMsg.getXform().setPosition(150, 7);
        this.mScoreMsg.setTextHeight(3);

    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        this.mCamera.setViewAndCameraMatrix();
        this.mBg.draw(this.mCamera);
        this.mAllObjs.draw(this.mCamera);
        this.mPatrols.draw(this.mCamera);

        this.mParticles.draw(this.mCamera);

        this.mMsg.draw(this.mCamera); 
        this.mPatrolsMsg.draw(this.mCamera);
        this.mDyepackMsg.draw(this.mCamera);
        this.mScoreMsg.draw(this.mCamera);

        this.setSmallerViewport(this.mHeroCam);
        this.setSmallerViewport(this.smallCam1);
        this.setSmallerViewport(this.smallCam2);
        this.setSmallerViewport(this.smallCam3);

    }

    setSmallerViewport(camera) {
        if(this.mCameraSet.getCameraIndex(camera) !== -1) {
            this.mCameraSet.setCameraMatrix(this.mCameraSet.getCameraIndex(camera));
            this.mBg.draw(camera);
            this.mAllObjs.draw(camera);
            this.mPatrols.draw(camera);
        }
    }

    // The Update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        this.mAllObjs.update(this.mCamera);
        this.mPatrols.update(this.mCamera);

        if (engine.input.isKeyClicked(engine.input.keys.P)) {
            this.autoSpawn = !this.autoSpawn;
        }
        if (engine.input.isKeyClicked(engine.input.keys.V)) {
            engine.physics.toggleHasMotion();
        }
        if (engine.input.isKeyClicked(engine.input.keys.H)) {
            this.randomizeVelocity();
        }

        if (engine.input.isKeyClicked(engine.input.keys.J)) {
            for (let i = 0; i < this.mPatrols.size(); i++){
                this.mPatrols.getObjectAt(i).hit();
            }
            this.mScore.increaseScoreBy(-10);
        }
        if (engine.input.isKeyClicked(engine.input.keys.B)) {
            for (let i = 0; i < this.mPatrols.size(); i++)
                this.mPatrols.getObjectAt(i).ToggleBox();
        }
        if (this.autoSpawn){
            if (this.cooldown < Date.now()){
                this.cooldown = Date.now() + (Math.random()*1000) + 2000;
                let x = 100 + Math.random()*95;
                let y = 37 + Math.random()*75;
                let sprite = (Math.random()-.5) < 0? this.kMinionSprite : this.kMinionSprite2;
                let m = new Head(sprite, x, y, this.mScore);
                m.NoteSet(this.mPatrols,this.mAllObjs);
                this.mPatrols.addToSet(m);
            }
        }
        
        this.viewportManipulationUpdate();

        if (engine.input.isKeyClicked(engine.input.keys.C)) {
            let x = 100 + Math.random()*95;
            let y = 37 + Math.random()*75;
            let sprite = (Math.random()-.5) < 0? this.kMinionSprite : this.kMinionSprite2;
            let m = new Head(sprite, x, y, this.mScore);
            m.NoteSet(this.mPatrols,this.mAllObjs);
            this.mPatrols.addToSet(m);
        }
        
        // Hero Movement System
        let hero = this.mAllObjs.getObjectAt(0); // Hero should always be first object loaded

        if(this.mCameraSet.getCameraIndex(this.mHeroCam) !== -1) {
            this.mHeroCam.update();
            this.mHeroCam.setWCCenter(this.mHero.getXform().getXPos(), this.mHero.getXform().getYPos());
        }
        
        if (this.mCamera.isMouseInViewport()) {
            hero.mouseControl(this.mCamera.mouseWCX(), this.mCamera.mouseWCY());   
        }
        if(engine.input.isKeyClicked(engine.input.keys.Q)) {
            hero.hit();
        }

        let index = this.mCameraSet.getCameraIndex(this.mHeroCam);
        if(hero.isHitAnimating() && hero.isVisible()) {
            if(index === -1)
                this.mCameraSet.addNewCamera(this.mHeroCam);
        } else {
            if(index !== -1 && !this.mCameraSet.getWasForced(index))
                this.mCameraSet.removeCameraAt(index);
        }

        // Spawn in DyePack projectiles
        if(engine.input.isKeyClicked(engine.input.keys.Space) && this.mHero.isVisible()) {
            let heroXForm = hero.getXform();
            let projectile = new DyePack(this.kMinionSprite, heroXForm.getXPos()+5, heroXForm.getYPos()+4, true, this.mScore);
            projectile.NoteSet(this.mAllObjs);
            projectile.toggleDrawRenderable();
            this.mAllObjs.addToSet(projectile);
        }

        this.updateDyepackCameras();

        this.showDyepackCamera(this.smallCam1);
        this.showDyepackCamera(this.smallCam2);
        this.showDyepackCamera(this.smallCam3);
        
        // Particle System
        this.mParticles.update();

        this.updateStatusMessages();

        if(this.mCameraSet.getCameraIndex(this.mHeroCam) !== -1) {
            this.mHeroCam.update();
            this.mHeroCam.setWCCenter(this.mHero.getXform().getXPos(), this.mHero.getXform().getYPos());
        }
        if(this.mCameraSet.getCameraIndex(this.smallCam1) !== -1)
            this.smallCam1.update();
        if(this.mCameraSet.getCameraIndex(this.smallCam2) !== -1)
            this.smallCam2.update();
        if(this.mCameraSet.getCameraIndex(this.smallCam3) !== -1)
            this.smallCam3.update();

        if(this.smallCam1.getDyepack() !== null) {
            this.smallCam1.setFocus(this.smallCam1.getDyepack());
        }
        if(this.smallCam2.getDyepack() !== null) {
            this.smallCam2.setFocus(this.smallCam2.getDyepack());
        }
        if(this.smallCam3.getDyepack() !== null) {
            this.smallCam3.setFocus(this.smallCam3.getDyepack());
        }
    }

    updateStatusMessages() {
        let autoSpawnMsg = "Auto Spawn: " + this.autoSpawn;
        this.mMsg.setText(autoSpawnMsg);

        let numPatrolsMsg = "# of Patrols: " + this.mPatrols.size();
        this.mPatrolsMsg.setText(numPatrolsMsg);

        let dyePackMsg = "# of Dyepacks: " + (this.mAllObjs.size() - 1);
        this.mDyepackMsg.setText(dyePackMsg);

        let scoreMsg = "Total Score: " + (this.mScore.getScore() - this.mHero.getHeroDeaths()*50);
        this.mScoreMsg.setText(scoreMsg);
    }

    showDyepackCamera(camera) {
        let index = this.mCameraSet.getCameraIndex(camera);
        if(camera.getDyepack() !== null && camera.getDyepack().isHitAnimating()) {
            if(index === -1)
                this.mCameraSet.addNewCamera(camera);
        } else {
            if(index !== -1 && !this.mCameraSet.getWasForced(index)) {
                this.mCameraSet.removeCameraAt(index);
                this.mOscillatingDyepacks.splice(this.mOscillatingDyepacks.indexOf(camera.getDyepack()), 1);
                camera.setDyepack(null);  
            }
        }
    }

    viewportManipulationUpdate() {
        //viewport manipulation
        //hero cam
        if (engine.input.isKeyClicked(engine.input.keys.Zero)) {
            this.hideOrShowCamera(this.mHeroCam);
        }
        //dye pack cameras
        if (engine.input.isKeyClicked(engine.input.keys.One)) {
            this.hideOrShowCamera(this.smallCam1);
        }
        if (engine.input.isKeyClicked(engine.input.keys.Two)) {
            this.hideOrShowCamera(this.smallCam2);
        }
        if (engine.input.isKeyClicked(engine.input.keys.Three)) {
            this.hideOrShowCamera(this.smallCam3);
        }

    }

    hideOrShowCamera(camera) {
        let index = this.mCameraSet.getCameraIndex(camera);
        if(index !== -1) {
            this.mCameraSet.setWasForced(false, index);
            this.mCameraSet.removeCameraAt(index);  
        }
        else {
            this.mCameraSet.addNewCamera(camera);
            index = this.mCameraSet.getCameraIndex(camera);
            this.mCameraSet.setWasForced(true, index);
        }
    }

    updateDyepackCameras() {
        //only add a new dyepack if there are less than 3 being displayed
        if(this.mOscillatingDyepacks.length < 3 && this.mAllObjs.size() > 1) {
            for(let i = 1; i < this.mAllObjs.size(); i++) {
                let dyepack = this.mAllObjs.getObjectAt(i);

                if(dyepack.isOnCamera) {
                    continue;
                }

                if(dyepack !== null && dyepack.isHitAnimating() && dyepack.isPlayerDye()) {
                    let camera = this.getFirstAvailZoomCam();   
                    if(camera !== null && camera.getDyepack() === null) {
                        this.mOscillatingDyepacks.push(dyepack);
                        camera.setDyepack(dyepack);
                        dyepack.setOnCamera(true);
                    }     
                }    
            }
        }
         
    }

    getFirstAvailZoomCam() {
        if(this.isZoomCamAvail()) {
            //get the camera index of the first available camera
            let index1 = this.mCameraSet.getCameraIndex(this.smallCam1);
            let index2 = this.mCameraSet.getCameraIndex(this.smallCam2);
            let index3 = this.mCameraSet.getCameraIndex(this.smallCam3);

            if(index1 === -1) {
                return this.smallCam1;
            }
            if(index2 === -1) {
                return this.smallCam2;
            }
            if(index3 === -1) {
                return this.smallCam3;
            }
        }
        return null;
        
    }
    isZoomCamAvail() {
        return ((this.mCameraSet.size() < 4 && 
            this.mCameraSet.getCameraIndex(this.mHeroCam) !== -1)
            || (this.mCameraSet.size() < 3 && 
                this.mCameraSet.getCameraIndex(this.mHeroCam) === -1));
    }
}

let kSpeed = 40;
MyGame.prototype.randomizeVelocity = function()
{
    let i = 0;
    for (i = 0; i<this.mPatrols.size(); i++) {
        let obj = this.mPatrols.getObjectAt(i);
        let rigidShape = obj.getRigidBody();
        let x = (Math.random() - 0.5) * kSpeed;
        let y = Math.random() * kSpeed * 0.5;
        rigidShape.setVelocity(x, y);
    }
}
export default MyGame;