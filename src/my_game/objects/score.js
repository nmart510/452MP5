/* File: hero.js 
 *
 * Creates and initializes the Hero (Dye)
 * overrides the update function of GameObject to define
 * simple Dye behavior
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

class Score {
    constructor() {
        this.mScore = 0;
    }

    getScore() { return this.mScore; }
    
    increaseScoreBy(delta) { this.mScore = this.mScore + delta} 
}

export default Score;