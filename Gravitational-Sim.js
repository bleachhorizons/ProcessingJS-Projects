/*
Plan:
Shiney silver ball in water has following forces:
- Fluid resistance (done)
- Wall/floor collisions (done)
- Gravitational attraction towards mouse (done)
- Gravity downward (done)
Forces can be toggled on and off with number keys, text in upper left displays them as off or on (done)
Have ball mover object.
Have apply force function within ball object.
Have 3 force calculation functions for ball object that call the apply force function within them.
Create separate function to interpret user input and run correct force functions. Have booleans telling whether to run each function that will change based on user input.
Have draw background function.
Have water object that stores water height (used as input for mover) and draws water (inside water object function).
*/

// Mover object
var Mover = function(x, y, m, d) {
    this.position = new PVector(x, y);
    this.velocity = new PVector(0, 0);
    this.acceleration = new PVector(0, 0);
    this.mass = m;
    this.diameter = d;
};
// Draw mover ball
Mover.prototype.draw = function() {
    noStroke();
    fill(255, 0, 0);
    ellipse(this.position.x, this.position.y, this.diameter, this.diameter);
};
// Update mover object
Mover.prototype.update = function() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0); // Reset acceleration so physics will not update off of previous frame
};
// Apply force procedure (input forces)
Mover.prototype.applyForce = function(f) {
    f = PVector.div(f, this.mass);
    this.acceleration.add(f);
};
// Calculate and apply gravity force
Mover.prototype.gravity = function() {
    var gravity = new PVector(0, 1 * this.mass);
    this.applyForce(gravity);
};
// Collision procedure (applied automatically)
Mover.prototype.collide = function() {
    // Detect collision
    if (this.position.x + this.diameter / 2 >= width) {
        this.velocity.x *= -1;
        this.position.x = width - this.diameter / 2;
    } else if (this.position.x - this.diameter / 2 <= 0) {
        this.velocity.x *= -1;
        this.position.x = this.diameter / 2;
    }
    if (this.position.y + this.diameter / 2 >= width) {
        this.velocity.y *= -1;
        this.position.y = height - this.diameter / 2;
    } else if (this.position.y - this.diameter / 2 <= 0) {
        this.velocity.y *= -1;
        this.position.y = this.diameter / 2;
    }
};
// Calculate and apply fluid force
Mover.prototype.fluid = function(inFluid, dragCo, a) {
    if (inFluid === true) {
        // Calculate fluid force
        var v = this.velocity.mag();
        var c = dragCo; // Drag force strength
        var dragMag = c * a * v * v;
        var force = this.velocity.get();
        force.mult(-1);
        force.normalize();
        force.mult(dragMag);
        // Apply fluid force
        this.applyForce(force);
    }
};
// Calculate and apply mouse attraction force
Mover.prototype.mouseAttract = function(strength, mouseMass) {
    var mouseLoc = new PVector(mouseX, mouseY);
    var G = strength; 
    var m1 = mouseMass;
    var m2 = this.mass;
    var rUV = PVector.sub(mouseLoc, this.position);
    var r2 = rUV.mag();
    r2 = constrain(r2, 15, 30);
    r2 = r2 * r2;
    rUV.normalize();
    var force = (G * m1 * m2) / r2;
    force = PVector.mult(rUV, force);
    // Apply gravitational force
    this.applyForce(force);
};

// Create and render fluid
var Fluid = function(sizeY, mover, thickness) {
    this.pos = new PVector(0, height);
    this.size = new PVector(width, sizeY);
    this.mover = mover;
    this.thickness = thickness;
};
// Draw fluid
Fluid.prototype.draw = function() {
    // Draw rectangle
    noStroke();
    fill(161, 202, 255); // Fluid color
    rectMode(CORNERS);
    rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
};
// Detect if mover is inside fluid function
Fluid.prototype.inFluid = function() {
    var m = this.mover;
    return m.position.x - m.diameter / 2 >= this.pos.x && m.position.x + m.diameter / 2 <= this.pos.x + this.size.x && m.position.y + m.diameter / 2 <= this.pos.y && m.position.y - m.diameter / 2 >= this.size.y;
};

// Instance fluid and mover
var ball = new Mover(200, 100, 10, 10);
var fluid = new Fluid(249, ball, 0.11); // Larger sizeY parameter = smaller fluid region

// Toggle Physics settings and display changes
var physics = {
    gravity: true,
    fluid: true,
    mouseAttract: false
}; // Values do not need to be stored inside an object*

// User input for physics booleans
var onePressed = false;
var twoPressed = false;
var threePressed = false;
var physicsToggle = function() {
    // Gravity
    if (keyIsPressed && key.toString() === '1' && onePressed === false) {
        physics.gravity = !physics.gravity;
        onePressed = true;
    } else if (!keyIsPressed) {
        onePressed = false;
    }
    // Fluid
    if (keyIsPressed && key.toString() === '2' && twoPressed === false) {
        physics.fluid = !physics.fluid;
        twoPressed = true;
    } else if (!keyIsPressed) {
        twoPressed = false;
    }
    // Mouse attraction
    if (keyIsPressed && key.toString() === '3' && threePressed === false) {
        physics.mouseAttract = !physics.mouseAttract;
        threePressed = true;
    } else if (!keyIsPressed) {
       threePressed = false;
    }
    
    // Display options
    var trueColor = color(0, 156, 16);
    var falseColor = color(181, 0, 0);
    textFont(createFont("sans-serif"), 10);
    textAlign(CENTER, BOTTOM);
    fill(0, 0, 0);
    text("Press '1' toggle gravity, '2' to toggle fluid, and '3' to toggle mouse gravitational attraction.", width / 2, 15);
    textAlign(LEFT, BOTTOM);
    if (physics.gravity === true) {
        fill(trueColor);
        text("GRAVITY ON", 7, 30);
    } else {
        fill(falseColor);
        text("GRAVITY OFF", 7, 30);
    }
    if (physics.fluid === true) {
        fill(trueColor);
        text("FLUID ON", 7, 45);
    } else {
        fill(falseColor);
        text("FLUID OFF", 7, 45);
    }
    if (physics.mouseAttract === true) {
        fill(trueColor);
        text("MOUSE ATTRACTION ON", 7, 60);
    } else {
        fill(falseColor);
        text("MOUSE ATTRACTION OFF", 7, 60);
    }
};

// Output code
draw = function() {
    background(255, 255, 255);
    
    // Check if physics are enabled
    if (physics.fluid === true) {
        fluid.draw();
        ball.fluid(fluid.inFluid(), fluid.thickness, ball.diameter);
    }
    if (physics.gravity === true) {
        ball.gravity();
    }
    if (physics.mouseAttract === true) {
        ball.mouseAttract(10, 10);
    }
    ball.collide();
    ball.update();
    ball.draw();
    
    // User input
    physicsToggle();
};