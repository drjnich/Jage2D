/*======================================================================
 * 
 * JAGE 2D : Javascript-Accelerated 2D Game Engine
 * 
 * Copyright (c) 2012 by Stephen Lindberg (sllindberg21@students.tntech.edu)
 * All rights reserved.
 * 
 * See README file for license.
======================================================================*/


/* *
 * JageTimer
 * A convenient timing mechanism that fonverts a frames per second frame rate to a millisecond delay and maintains a frame rate counter.
 * Input: fps - The desired frame rate for your app in frames per second. This is set to 60.0 by default.
 * */

function JageTimer(fps) {
    // DATA 
    
    this.preferredFrameRate = fps;
    this.delay = 0;
    this.frameRate = 0;
    this.ticks = 0;
    this.startTime = new Date().getTime();
    
    // METHODS 
    
    /** Sets the millisecond delay for the timer to match a desired frame rate in frames per second. */
    this.setFrameRate = function (fps) {
        this.preferredFrameRate = fps;
        this.delay = Math.round(1000.0 / fps);
    }
    
    /** Updates the frame rate if 0.5 seconds has passed. */
    this.updateFrameRate = function () {
        this.ticks += 1;
        var now = new Date().getTime();
        
        if (now - this.startTime >= 500) {
            this.frameRate = 1000.0*this.ticks/(now - this.startTime);
            this.frameRate = Math.round(this.frameRate*10)/10.0;
            
            this.startTime = now;
            this.ticks = 0;
        }
    }
    
    // CONSTRUCTION
    
    if(!fps) 
        fps = 60.0;
    this.setFrameRate(fps);
}

 
/* *
 * JageApp
 * An interface representing an a game or application using Jage2D components. 
 * This interface provides basic methods for running iterations through 
 * your app's logic and for performing rendering iterations.
 *
 * The user is expected to override the logic and render methods.
 * Inputs: 
 *      canvas is a Canvas object.
 *      id is an optional unique string id for this JageApp instance.
 *      frameRate is the desired frameRate for our application in frames per second. (default is 60.0)
 * */

function JageApp(canvas, id, frameRate) {
    // DATA
    
    // A string to uniquely identify this app instance. 
    this.id = id;
    
    // The JagePen for drawing on the app's Canvas.
    this.pen = new JagePen(canvas.getContext("2d"));
    
    // A flag for saying that our app is loading something.
    this.isLoading = false;
    
    // A flag for saying that this app is not running.
    this.isRunning = false;
    
    // This app's timer.
    this.timer = new JageTimer(frameRate);
    
    // The app will perform this many iterations of the logic method per iteration of the render method.
    this.stepsPerFrame = 1;
    
    
    var x = 0;
    
    
    // METHODS
    
    /** Starts our application. */
    this.start = function() {
        this.isRunning = true;
        this.step();
    }
    
    /** Performs one or more steps through this.logic and one step through this.render. */
    this.step = function () {
        // if this app isn't running, skip this step().
        if(!this.isRunning)
            return;
        
        // run n iterations through our logic (just 1 by default), then render our app.
        for(var i = 0; i < this.stepsPerFrame; i++) {
            this.logic();
        }
        this.render(this.pen);
        
        this.timer.updateFrameRate();
        
        // schedule this app to be run again soon.
        Jage.apps.push(this);
        setTimeout(Jage.timerHandler, this.timer.delay);
    }
    
    /** Stop our application. */
    this.stop = function() {
        this.isRunning = false;
    }
    
    /** Performs a step through the app's logic. The default implementation does nothing. */
    this.logic = function() { 
        if(!this.dx)
            this.dx = Math.random()*5 + 0.1;
        x += this.dx; 
    } 
    
    /** Renders the app to its Canvas. The default implementation paints the Canvas completely white and displays the frame rate. */
    this.render = function(pen) {
        pen.clear("white");
        pen.setFill("black");
        pen.pen.font = "16px sans-serif";
        pen.drawString(this.timer.frameRate, x % 640,30, null, pen.ONLYFILL);
        pen.drawString(this.timer.preferredFrameRate, 20, 50, null, pen.ONLYFILL);
    }
}


 
 
 
