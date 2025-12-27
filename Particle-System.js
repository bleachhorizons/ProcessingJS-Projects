/*
SIMPLE PARTICLE SIMULATOR:
- Particle system that has 2 types of particles, each with their own looks and forces. One can bounce and one is normal.
- Square is drawn on screen that repels particles and can be dragged and dropped by the user
*/

// Setup
angleMode = "radians";

// Single particle object
var Particle = function(position, lifeTime, size) {
    this.position = position.get();
    this.velocity = new PVector(random(-1.5, 1.5), 0);
    this.acceleration = new PVector(0, 0.1);
    this.size = size.get();
    this.lifeTime = lifeTime;
    this.currentLifeTime = lifeTime;
};
// Update particle physics
Particle.prototype.update = function() {
    var gravity = new PVector(0, 0.1); // Create gravity force
    this.applyForce(gravity); // Apply gravity force
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    this.currentLifeTime -= 1;
};
// Draw particle
Particle.prototype.draw = function() {
    var fade = map(this.currentLifeTime, 0, this.lifeTime, -3000, 255);
    fill(255, 0, 0, fade);
    pushMatrix();
    translate(this.position.x, this.position.y);
    var angle = this.position.x * 5 + 200;
    var angle = map(angle, 0, width, 0, TWO_PI);
    rotate(angle);
    imageMode(CENTER);
    image(getImage("avatars/duskpin-seed"), 0, 0, this.size.x, this.size.y);
    popMatrix();
};
// Run functions
Particle.prototype.run = function() {
    this.update();
    this.draw();
};
// Apply force function
Particle.prototype.applyForce = function(force) {
    this.acceleration.add(force);
};

// Particle system object variant (bouncy)
var bouncyParticle = function(position, lifeTime, size) {
    Particle.call(this, position, lifeTime, size);
    // Assign size variable
    if (size instanceof PVector) {
        this.size = size.get();
    } else {
        this.size = new PVector(10, 10);
    }
};
// Add Particle functions to bouncyParticle
bouncyParticle.prototype = Object.create(Particle.prototype);
// Display bouncy particles
bouncyParticle.prototype.draw = function() {
    var fade = map(this.currentLifeTime, 0, this.lifeTime, 0, 255);
    stroke(0, 0, 0, fade);
    strokeWeight(1);
    fill(130, 182, 255, fade);
    ellipse(this.position.x, this.position.y, this.size.x, this.size.y);
};
// Bounce particles
bouncyParticle.prototype.bounce = function() {
    if (this.position.x + this.size.x / 2 >= width || this.position.x - this.size.x / 2 <= 0) {
        this.velocity.x *= -1;
        
    }
    if (this.position.y + this.size.y / 2 >= height || this.position.y - this.size.y / 2 <= 0) {
        this.velocity.y *= -1;
    }
};
// Run functions
bouncyParticle.prototype.run = function() {
    this.bounce();
    this.update();
    this.draw();
};

// Repulsion object (square)
var Repel = function(position, size, strength, color, clickedColor) {
    this.position = position.get();
    if (size instanceof PVector) {
        this.size = size.get();
    } else {
        this.size = new PVector(20, 20);
    }
    this.strength = strength;
    this.clicked = false;
    this.color = color;
    this.clickedColor = clickedColor;
};
// Draw repulsion object (square)
Repel.prototype.draw = function() {
    strokeWeight(3);
    if (this.clicked === true) {
        fill(this.clickedColor);
    } else {
        fill(this.color);
    }
    rectMode(CENTER);
    rect(this.position.x, this.position.y, this.size.x, this.size.y);
};
// Move repulsion object
Repel.prototype.move = function() {
    if (mouseIsPressed === true && mouseX >= this.position.x - this.size.x / 2 && mouseX <= this.position.x + this.size.x / 2 && mouseY >= this.position.y - this.size.y / 2 && mouseY <= this.position.y + this.size.y / 2) {
        this.clicked = true;
        this.position.x = mouseX;
        this.position.y = mouseY;
    } else {
        this.clicked = false;
    }
};
// Repel function
Repel.prototype.repel = function(particle) {
    // Calculate repulsion force
    var force = PVector.sub(this.position, particle.position);
    var power = -1 * this.strength / (force.mag() * force.mag());
    power = constrain(power, -10, 10); // Limit repulsion speed
    force.normalize();
    force.mult(power);
    particle.applyForce(force);
};

// Particle system object
var ParticleSystem = function(origin, type, lifeTime, size) {
    this.origin = origin.get();
    if (size instanceof PVector) {
        this.size = size.get();
    } else {
        this.size = new PVector(10, 10);
    }
    this.type = type;
    this.lifeTime = lifeTime;
    this.particles = [];
};
// Summon particles to system
ParticleSystem.prototype.addParticle = function() {
    // Add particle every 2 frames
    if (frameCount % 5 === 0) {
        this.particles.push(new this.type(this.origin, this.lifeTime, this.size));
    }
};
// Run and update particle system
ParticleSystem.prototype.update = function() {
    // Update particles
    for (var i = 0; i < this.particles.length; i++) {
        // Run particles
        this.particles[i].run();
        // Delete particles
        if (this.particles[i].currentLifeTime <= 0) {
            this.particles.splice(i, 1);
        }
    }
};

// Instance particle system and repulsion object
var system = new ParticleSystem(new PVector(width / 2, height / 4), Particle, 1000, new PVector(30, 30));
var bouncySystem = new ParticleSystem(new PVector(width / 2, height * 3 / 4), bouncyParticle, 200);
var repulsion = new Repel(new PVector(width / 2, height / 2), new PVector(50, 50), 50 * 4, color(255, 183, 0), color(89, 64, 0));

draw = function() {
    background(255, 255, 255);
    // Draw repulsion object
    repulsion.move();
    repulsion.draw();
    // Repel normal particles
    for (var i = 0; i < system.particles.length; i++) {
        repulsion.repel(system.particles[i]);
    }
    // Repel bouncy particles
    for (var i = 0; i < bouncySystem.particles.length; i++) {
        repulsion.repel(bouncySystem.particles[i]);
    }
    system.addParticle();
    system.update();
    bouncySystem.addParticle();
    bouncySystem.update();
};