/*** SANDBOX PLANE GAME ***/

// Plane object
var Plane = function() {
    this.position = new PVector(width / 2, height / 2);
    this.speed = new PVector(0, 0);
    this.aceleration = new PVector(0, 0);
    this.inWind = false;
};

// Create single weather region
var Wind = function(x, y, xSize, ySize, dirX, dirY, windSpeed) {
    this.loc = new PVector(x, y); // Location of wind region (from top right corner)
    this.size = new PVector(xSize, ySize); // Size of wind region
    this.dir = new PVector(dirX, dirY); // Direction wind is blowing
    this.dir.normalize();
    this.dir.mult(windSpeed); // Adjust power of wind
};

// Display wind region
Wind.prototype.Display = function() {
    // Display wind region
    rectMode(CORNER);
    noStroke();
    fill(255, 255, 255, 80); // Wind color
    rect(this.loc.x, this.loc.y, this.size.x, this.size.y, 10); // Draw wind region
};

// Instance wind regions and check if plane is inside them
Plane.prototype.InstanceWind = function(numWind) {
    var numWind = numWind; // Number of wind regions
    this.winds = []; // Array containing wind objects
    // Generate wind regions into list
    for (var i = 0; i < numWind; i++) {
        var sizeX = random(80, 120);
        var sizeY = random(80, 120);
        this.winds.push(new Wind(random(0, width - sizeX), random(0, 325 - sizeY), sizeX, sizeY, random(-1, 1), random(-1, 1), random(0, 1.2)));
    }
};

// Check if plane is inside wind region and update accordingly
Plane.prototype.UpdateWind = function() {
    var inWind = false;
    // Compare wind regions and determine inWind boolean
    for (var i = 0; i < this.winds.length; i++) {
        if (this.position.x >= this.winds[i].loc.x && this.position.x <= this.winds[i].loc.x + this.winds[i].size.x && this.position.y >= this.winds[i].loc.y && this.position.y <= this.winds[i].loc.y + this.winds[i].size.y) {
            inWind = true;
            // Blow plane by adding wind
            this.position.add(this.winds[i].dir);
        }
    }
    if (inWind === true) {
        this.inWind = true;
    }
    else {
        this.inWind = false;
    }
};

// Restrict plane play area (used in update function)
Plane.prototype.Border = function() {
    // Create a check to know if the plane is outside the play area
    if (this.position.x < 0) {
        this.position.x = 0;
    }
    else if (this.position.x > width) {
        this.position.x = width;
    }
    if (this.position.y < 0) {
        this.position.y = 0;
    }
    else if (this.position.y > height - 75) {
        this.position.y = width - 75;
    }
};

// Move plane
Plane.prototype.Update = function() {
    // Setup constraints
    var accelSpeed = 0.07;
    var maxSpeed = 3;
    // Update acceleration
    var mousePos = new PVector(mouseX, mouseY);
    this.direction = PVector.sub(mousePos, this.position);
    this.direction.normalize();
    this.direction.mult(accelSpeed);
    
    // Move plan with speed and acceleration
    this.acceleration = this.direction;
    this.speed.add(this.acceleration);
    this.speed.limit(maxSpeed);
    this.position.add(this.speed);
    
    // Restrict plane location to visible area (run border function)
    this.Border();
};

// Display dashboard
Plane.prototype.Dashboard = function() {
    // Draw Back board
    rectMode(CENTER);
    stroke(0, 0, 0);
    strokeWeight(8);
    fill(156, 156, 156); // Back board color
    rect(200, 382, width + 10, 114, 26); // Draw back board
    
    // Draw directional screen
    var dirScreen = new PVector(125, 364);
    var angle = round(this.speed.heading());
    stroke(0, 0, 0);
    strokeWeight(1);
    fill(120, 222, 113); // Back board color
    rect(dirScreen.x, dirScreen.y, 120, 50, 5); // Draw directional screen
    
    // Draw plane direction icon
    pushMatrix();
    noStroke();
    fill(255, 0, 0); // Plane icon color
    translate(dirScreen.x, dirScreen.y);
    rotate(angle); // Rotate to planes orientation
    triangle(0, -10, -5, 5, 5, 5); // Draw plane icon
    popMatrix();
    
    // Write angle text
    textAlign(CENTER);
    textFont(createFont("monospace"), 10);
    fill(0, 0, 0); // Text color
    text("Direction: " + angle, dirScreen.x, dirScreen.y + 20); // Write text
    
    // Draw compass
    stroke(89, 89, 89);
    strokeWeight(2);
    line(dirScreen.x - 50, dirScreen.y - 5, dirScreen.x  - 33, dirScreen.y - 5); // Horizontal line
    line(dirScreen.x - 41, dirScreen.y - 15, dirScreen.x - 41, dirScreen.y + 4); // Vertical line
    text("N", dirScreen.x - 27, dirScreen.y - 2); 
    
    // Draw speedometer back
    var speedometerBack = new PVector(205, 340);
    var speedoLengthX = 168;
    var speedoLengthY = 18;
    rectMode(CORNER);
    stroke(0, 0, 0);
    strokeWeight(1);
    fill(255, 255, 255);
    rect(speedometerBack.x, speedometerBack.y, speedoLengthX, speedoLengthY);
    
    // Draw speedometer level bar
    var speedometer = new PVector(this.speed.x, this.speed.y);
    speedometer.normalize();
    speedometer.mult(speedoLengthX);
    var speedLength = abs(speedometer.y);
    noStroke();
    fill(255, 0, 0); // Speedometer bar color
    rect(speedometerBack.x, speedometerBack.y, speedLength, speedoLengthY); // Draw speedometer bar
    
    // Draw speedometer units
    for (var i = 0; i < 5; i++) {
        var x = 205 + 41 * i;
        var y = 363;
        var unit = 40 * i;
        stroke(0, 0, 0);
        strokeWeight(1);
        line(x, y, x, y + 6); // Draw unit mark line
        fill(0, 0, 0); // Text color
        text(unit + "kt", x, y + 18); // Draw unit text
    }
    
    // Draw wind indicator
    var windPos = new PVector(33, dirScreen.y);
    stroke(0, 0, 0);
    strokeWeight(1);
    if (this.inWind) {
        rectMode(CENTER);
        fill(21, 255, 0); // Indicator true color
        rect(windPos.x, windPos.y, 37, 50, 5); // Draw indicator
        textAlign(CENTER, CENTER);
        textSize(13);
        fill(0, 0, 0); // Text color
        text("TRUE", windPos.x, windPos.y + 12); // In wind text
    }
    else {
        rectMode(CENTER);
        fill(196, 42, 42); // Indicator false color
        rect(windPos.x, windPos.y, 37, 50, 5); // Draw indicator
        textAlign(CENTER, CENTER);
        textSize(11);
        fill(0, 0, 0); // Text color
        text("FALSE", windPos.x, windPos.y + 14); // Outside wind text
    }
    fill(0, 0, 0); // "Wind check" color
    textSize(12);
    text("In \n wind:", windPos.x, windPos.y - 9); // "In wind" text
};

// Display the plane
Plane.prototype.Display = function() {
    // Setup
    noStroke();
    rectMode(CENTER);
    // Calculate plan angle and position
    var angle = this.speed.heading();
    var displayPos = new PVector(0, 0);
    var shadowOffset = new PVector(-23, -36);
    // Display plane shadow
    pushMatrix();
    translate(this.position.x, this.position.y);
    rotate(angle);
    fill(0, 0, 0, 30); // Shadow color
    rect(displayPos.x + 15 + shadowOffset.x, displayPos.y  + shadowOffset.y, 12, 5); // Propeller rod
    rect(displayPos.x + 19 + shadowOffset.x, displayPos.y + shadowOffset.y, 1, 13); // Propeller
    rect(displayPos.x + shadowOffset.x, displayPos.y + shadowOffset.y, 36, 8, -1); // Plane body
    rect(displayPos.x + shadowOffset.x, displayPos.y + shadowOffset.y, 9, 37, 4); // Plane wing
    rect(displayPos.x - 19 + shadowOffset.x, displayPos.y + shadowOffset.y, 6, 21, 4); // Plane rear wing
    popMatrix();
    
    // Display plane
    pushMatrix();
    translate(this.position.x, this.position.y);
    rotate(angle);
    fill(0, 0, 0); // Black
    rect(displayPos.x + 15, displayPos.y, 12, 5); // Propeller rod
    rect(displayPos.x + 19, displayPos.y, 1, 13); // Propeller
    fill(255, 225, 0); // Plane color
    rect(displayPos.x, displayPos.y, 36, 8, -1); // Plane body
    rect(displayPos.x, displayPos.y, 9, 37, 4); // Plane wing
    rect(displayPos.x - 19, displayPos.y, 6, 21, 4); // Plane rear wing
    popMatrix();
};

// Background function
var numTrees = 20;
var trees = []; // Random tree coordinates stored in list as vectors
for (var i = 0; i < numTrees; i++) {
    trees.push(new PVector(random(0, 175), random(0, height - 75)));
}
var DrawBackground = function() {
    background(97, 135, 106); // Grass color
    // Draw lake
    stroke(68, 110, 65);
    strokeWeight(7);
    fill(83, 219, 203); // Water color
    ellipse(280, 171, 159, 233); // Draw lake
    // Draw trees (using random)
    noStroke();
    fill(63, 87, 68); // Tree ellipse color
    for (var i = 0; i < trees.length; i++) {
        ellipse(trees[i].x, trees[i].y, 30, 30);
    }
};

// Instance plane and wind
var plane = new Plane();
plane.InstanceWind(3);

draw = function() {
    // Draw backdrop
    DrawBackground();
    // Run wind functions (using plane object)
    for (var i = 0; i < plane.winds.length; i++) {
        plane.winds[i].Display();
    }
    // Run plane functions
    plane.Update();
    plane.UpdateWind();
    plane.Display();
    plane.Dashboard();
};