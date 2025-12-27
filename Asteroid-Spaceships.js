/*
{
Main:
- Jet moves using keyboard controls (with boost) (FINISHED)
- Jet shoots fast projectiles at a fast speed. Use space to shoot (FINISHED)
- Moving targets with health bars. Targets will be an object with different properties, and will all be contained/appended into one list. Targets continually spawn. (DONE)
Extra:
- Cool looking jet (DONE)
- Glowing after burner trail (DONE)
- Glowing projectiles (DONE)
- Hit FX (DONE)
- Detailed/shiney targets (DONE)
- Wing trail FX (DONE)
- Speedometer and stats (HUD) (DONE)
- Add life timer to targets (DONE)
- Add bullet trail (DONE)
}
*/

// Setup
var fps = 60;
frameRate(fps);

// Organize multiple key presses
var activeKeys = [];
keyPressed = function() {
    for (var i = 0; i < activeKeys.length; i++) {
        if (activeKeys[i] === keyCode) {
            return;
        }
    }
    activeKeys.push(keyCode);
};
keyReleased = function() {
    for (var i = 0; i < activeKeys.length; i++) {
        if (activeKeys[i] === keyCode) {
            activeKeys.splice(i, i + 1);
        }
    }
};
var containsKey = function(key) {
    for (var i = 0; i < activeKeys.length; i++) {
        if (activeKeys[i] === key) {
            return true;
        }
    }
    return false;
};

// HUD function
var bulletsShot = 0;
var targetsHit = 0;
var accuracy = 0;
var score = 0;
var DrawHUD = function(jet, HUDColor, textColor) {
    var HUDSize = new PVector(width, 52);
    var opacityScale = 255 / HUDSize.y;
    // Draw HUD background gradient
    for (var i = 0; i < HUDSize.y; i++) {
        noStroke();
        rectMode(CORNER);
        fill(HUDColor, 255 - opacityScale * i); // HUD color
        rect(0, i, HUDSize.x, 1);
    }
    
    // Calculate accuracy and speed
    var accuracy = 0;
    if (bulletsShot > 0) {
        accuracy = round(targetsHit / bulletsShot * 10000) / 100;
        accuracy = constrain(accuracy, 0, 100);
    }
    var speed = round(jet.velocity.mag() * 10) / 10 * 60;
    // Draw score, accuracy, and speed
    textFont(createFont("fantasy"), 18);
    textAlign(CENTER, BOTTOM);
    fill(textColor, 200); // HUD Text color
    text("Score: " + score + " | Accuracy: " + accuracy + "%" + " | Speed: " + speed + " px/s", width / 2, 30); // Draw score
};

// Outputs random true or false boolean
var randomTF = function() {
    if (round(random(0, 1)) === 0) {
        return true;
    } else {
        return false;
    }
};

// Jet Object
var Jet = function() {
    this.position = new PVector(width / 2, height / 2);
    this.size = new PVector(16, 14);
    this.velocity = new PVector(0, 0);
    this.acceleration = new PVector(0, -0.5);
    this.turnAccel = 6.5;
    this.topSpeed = 2;
    this.boostOn = false;
};
// Add force
Jet.prototype.applyForce = function(force) {
    this.acceleration.add(force);
};
// User input movement
Jet.prototype.move = function() {
    // Boost and slow speeds
    var speed = {
        normal: 1.5,
        slow: 1,
        boost: 4
    };
    // Initialize turning and boosting forces
    var boost = this.velocity.get();
    boost.normalize();
    boost.mult(speed.boost / 20);
    var turnLeft = this.velocity.get();
    var turnRight = this.velocity.get();
    turnLeft.rotate(-this.turnAccel);
    turnRight.rotate(this.turnAccel);
    
    // Check for user input
    if (containsKey(38)) {
        // Boost
        this.boostOn = true;
        this.topSpeed = speed.boost;
        this.applyForce(boost);
    } else if (this.topSpeed !== speed.normal && this.topSpeed !== speed.slow){
        this.boostOn = false;
        this.topSpeed = speed.normal;
    }
    if (containsKey(37)) {
        // Turn left
        this.applyForce(turnLeft);
    }
    if (containsKey(39)) {
        // Turn right
        this.applyForce(turnRight);
    }
    if (containsKey(40)) {
        // Slow down
        this.boostOn = false;
        this.topSpeed = speed.slow;
    }
};
// Update jet position
Jet.prototype.update = function() {
    // Update plane position
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.topSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    
    // Check for out of bounds (edges)
    if (this.position.x > width + this.size.y) {
        this.position.x = -this.size.y;
    } else if (this.position.x < -this.size.y) {
        this.position.x = width + this.size.y;
    } else if (this.position.y > height + this.size.y) {
        this.position.y = -this.size.y;
    } else if (this.position.y < -this.size.y) {
        this.position.y = height + this.size.y;
    }
};
// Draw jet
var boostTrail = []; // Holds coordinates for boost trail
var wingTrail = []; // Holds coordinates for wing trail
Jet.prototype.draw = function(boostColor, outlineColor) {
    // Draw boost trail
    if (this.boostOn === true) {
        var pos = this.position.get();
        boostTrail.push([pos, millis()]);
    }
    for (var i = 0; i < boostTrail.length; i++) {
        // Display boost ellipses
        var diameter = 5;
        var count = 1;
        var bloom = diameter;
        var brightness = 7;
        while (count < bloom + 1) {
            fill(boostColor, 10 / (count / 8));
            ellipse(boostTrail[i][0].x, boostTrail[i][0].y, diameter + count / 4 * brightness, diameter + count / 4 * brightness);
            count++;
        }
        
        // Delete boost when time is up
        var time = millis();
        if (time - boostTrail[i][1] > 150) {
            boostTrail.splice(i, 1);
        }
    }
        
    // Wing trail (may slow program down)
    var trailLength = 50;
    var xOffset = 15;
    var yOffset = 16;
    wingTrail.push({pos: this.position.get(), angle: this.velocity.heading()});
    for (var i = 0; i < wingTrail.length; i++) {
        // Draw wing Trail
        pushMatrix();
        translate(wingTrail[i].pos.x, wingTrail[i].pos.y);
        rotate(wingTrail[i].angle + 90);
        noStroke();
        fill(255, 255, 255, 255 / (i + 1) * 3);
        ellipse(-xOffset, yOffset, 0.1 * i, 0.1 * i); // Draw left ellipse trail
        ellipse(xOffset, yOffset, 0.1 * i, 0.1 * i); // Draw right ellipse trail
        popMatrix();
    }
    // Limit trail length
    if (wingTrail.length > trailLength) {
        wingTrail.shift();
    }
    // Draw jet
    pushMatrix();
    translate(this.position.x, this.position.y);
    rotate(this.velocity.heading() + 90);
    // Draw thrusters
    noStroke();
    rectMode(CENTER);
    fill(outlineColor);
    quad(-8, 10, -6, 20, 6, 20, 8, 10);
    // Draw jet body
    stroke(outlineColor);
    strokeWeight(2);
    fill(173, 173, 173);
    triangle(0, -this.size.y, -this.size.x, this.size.y, this.size.x, this.size.y);
    popMatrix();
};
// Shoot and draw projectiles
var bullets = [];
var lastShot = millis();
Jet.prototype.shoot = function() {
    var fireRate = 125;
    var bulletLife = 1500;
    var bulletSpeed = 10;
    // Shoot projectiles
    if (containsKey(32) && fireRate <= millis() - lastShot) {
        // Instance projectile
        var bullet = this.position.get();
        var drawPos = this.position.get();
        var bulletV = this.velocity.get(); // Determines speed and direction bullet travels
        bulletV.normalize();
        bulletV.mult(bulletSpeed);
        bullets.push({initialPos: drawPos, pos: bullet, vel: bulletV, time: millis(), hitTarget: false, targetsHit: []});
        lastShot = millis();
        bulletsShot++;
    }
    
    // Update and draw projectiles
    for (var i = 0; i < bullets.length; i++) {
        // Draw bullet trail
        stroke(255, 255, 255, 75);
        line(bullets[i].initialPos.x, bullets[i].initialPos.y, bullets[i].pos.x, bullets[i].pos.y);
        // Draw projectiles
        pushMatrix();
        translate(bullets[i].pos.x, bullets[i].pos.y);
        rotate(bullets[i].vel.heading());
        // Create glowing effect and draw projectile
        var sizeX = 15;
        var sizeY = 5;
        var bloom = 7;
        var brightness = 0.7;
        var count = 1;
        while (count < bloom + 1) {
            noStroke();
            fill(230, 192, 172, 10 / (count / 8)); // Projectile color
            rect(0, 0, sizeX * count * brightness, sizeY * count * brightness, 10);
            count++;
        }
        popMatrix();
        
        // Update projectile position
        bullets[i].pos.add(bullets[i].vel);
        
        // Delete bullet after 'bulletLife' time
        bullets[i].time++;
        if (bullets[i].time <= millis() - bulletLife) {
            if (bullets[i].hitTarget === false) {
                score -= 5; // Lower score if bullet does not hit a target
            }
            bullets.splice(i, i + 1);
        }
    }
};

// Target object
var Target = function() {
    this.position = new PVector(random(30, width - 30), random(30, height - 30));
    this.velocity = new PVector(0, 0);
    this.size = new PVector(0, 0);
    this.color = color(255, 255, 255); // Target color
    this.targetType = round(random(0, 2)); // Static (0), Move on single axis (1), Free movement (2)
    this.health = 100;
    this.time = millis();
    this.hitTime = 0;
    this.lastSecond = 0; // Instance second counter to display time
    
    // Determine features based on target type
    if (this.targetType === 0) {
        this.size = new PVector(random(10, 50), random(10, 50));
        this.color = color(255, 0, 0);
    } else if (this.targetType === 1) {
        this.size = new PVector(random(20, 30), 0);
        this.size.y = this.size.x;
        this.axis = round(random(0, 1)); // 0 = x-axis, 1 = y-axis
        this.startDir = round(random(0, 1)); // Direction target will start going
        this.color = color(0, 102, 255);
    } else {
        this.size = new PVector(random(25, 35), 0);
        this.size.y = this.size.x;
        this.xStart = random(-1000, 1000);
        this.yStart = random(-1000, 1000);
        this.xIsNeg = false;
        this.yIsNeg = false;
        if (randomTF() === true) {
            this.xIsNeg = true;
        }
        if (randomTF() === true) {
            this.yIsNeg = true;
        }
        this.color = color(162, 0, 255);
    }
};
// Draw target
Target.prototype.draw = function(timerColor) {
    // Hit Effect color
    var duration = 50;
    if (millis() - this.hitTime < duration) {
        this.color = color(255, 255, 255);
    } else if (this.targetType === 0) {
        this.color = color(255, 0, 0);
    } else if (this.targetType === 1) {
        this.color = color(0, 102, 255);
    } else {
        this.color = color(162, 0, 255);
    }
    // Draw targets dependent on their target type
    if (this.targetType === 0) {
        // Draw static target
        noStroke();
        fill(this.color); // Target color
        rectMode(CENTER);
        rect(this.position.x, this.position.y, this.size.x, this.size.y);
        // Draw gradient effect
        for (var i = 0; i < this.size.y; i++) {
            stroke(61, 61, 61, 200 / (i + 1) * 2);
            strokeWeight(1);
            line(this.position.x - this.size.x / 2, this.position.y + this.size.y / 2 - i, this.position.x + this.size.x / 2, this.position.y + this.size.y / 2 - i);
        }
        
        // Draw health bar
        var healthWidth = 50;
        var healthHeight = 7;
        this.health = constrain(this.health, 0, 100);
        fill(255, 0, 0);
        rectMode(CENTER);
        rect(this.position.x, this.position.y - this.size.y / 2 - 12, healthWidth, healthHeight, 20); // Draw red bar
        fill(0, 173, 6);
        rect(this.position.x - 0.25 * (100 - this.health), this.position.y - this.size.y / 2 - 12, healthWidth * this.health / 100, healthHeight, 20); // Draw green bar
    } else if (this.targetType === 1) {
        // Draw moving target
        noStroke();
        fill(this.color); // Target color
        ellipse(this.position.x, this.position.y, this.size.x, this.size.y);
        // Draw shine effect
        var bloom = 21;
        var brightness = 0.07;
        var count = 1;
        while (count < bloom + 1) {
            noStroke();
            fill(255, 255, 255, 10 / (count / 8)); // Spectacle color
            ellipse(this.position.x - this.size.x * 0.1, this.position.y- this.size.y * 0.1, this.size.x * count * brightness, this.size.y * count * brightness);
            count++;
        }
        
        // Draw health bar
        var healthWidth = 50;
        var healthHeight = 7;
        this.health = constrain(this.health, 0, 100);
        fill(255, 0, 0);
        rectMode(CENTER);
        rect(this.position.x, this.position.y - this.size.x / 2 - 10, healthWidth, healthHeight, 20); // Draw red bar
        fill(0, 173, 6);
        rect(this.position.x - 0.25 * (100 - this.health), this.position.y - this.size.x / 2 - 10, healthWidth * this.health / 100, healthHeight, 20); // Draw green bar
    } else {
        // Draw freely moving target
        noStroke();
        fill(this.color); // Target color
        ellipse(this.position.x, this.position.y, this.size.x, this.size.y);
        // Draw shine effect
        var bloom = 21;
        var brightness = 0.07;
        var count = 1;
        while (count < bloom + 1) {
            noStroke();
            fill(255, 255, 255, 10 / (count / 8)); // Spectacle color
            ellipse(this.position.x - this.size.x * 0.1, this.position.y- this.size.y * 0.1, this.size.x * count * brightness, this.size.y * count * brightness);
            count++;
        }
        
        // Draw health bar
        var healthWidth = 50;
        var healthHeight = 7;
        this.health = constrain(this.health, 0, 100);
        fill(255, 0, 0);
        rectMode(CENTER);
        rect(this.position.x, this.position.y - this.size.x / 2 - 10, healthWidth, healthHeight, 20); // Draw red bar
        fill(0, 173, 6);
        rect(this.position.x - 0.25 * (100 - this.health), this.position.y - this.size.x / 2 - 10, healthWidth * this.health / 100, healthHeight, 20); // Draw green bar
    }
    // Draw life timer
    textFont(createFont("san-serif"), 16);
    textAlign(CENTER, CENTER);
    fill(timerColor); // Timer text color
    var time = 8 - round((millis() - this.time) / 1000);
    text(time, this.position.x, this.position.y + this.size.y / 2 + 10);
};
// Update target position based on target type
Target.prototype.update = function() {
    var axisSpeed = 2;
    var xOff = 0.05;
    var yOff = 0.05;
    var moveScale = 2;
    if (this.targetType === 1) {
        // Move target on single axis
        if (this.axis === 0) {
            // Move targets along x-axis
            // Moving target for the first time
            if (this.velocity.x === 0) {
                if (this.startDir === 0) {
                    this.velocity.x += axisSpeed; // Move right
                } else {
                    this.velocity.x -= axisSpeed; // Move left
                }
                
            }
            if (this.position.x + this.size.x / 2 >= width || this.position.x - this.size.x / 2 <= 0) {
                // Reverse direction
                this.velocity.mult(-1);
            }
        } else {
            // Move targets along y-axis
            // Moving target for the first time
            if (this.velocity.y === 0) {
                if (this.startDir === 0) {
                    this.velocity.y += axisSpeed; // Move right
                } else {
                    this.velocity.y -= axisSpeed; // Move left
                }
                
            }
            if (this.position.y + this.size.x / 2 >= height || this.position.y - this.size.x / 2 <= 0) {
                // Reverse direction
                this.velocity.mult(-1);
            }
        }
    } else if (this.targetType === 2) {
        // Move target freely using noise
        var x = noise(this.xStart) * moveScale;
        var y = noise(this.yStart) * moveScale;
        if (this.xIsNeg === true) {
            x *= -1;
        }
        if (this.yIsNeg === true) {
            y *= -1;
        }
        var moveDir = new PVector(x, y);
        this.xStart += xOff;
        this.yStart += yOff;
        this.velocity.mult(0);
        this.velocity.add(moveDir);
        
        // Check if target moves off screen
        if (this.position.x - this.size.x / 2 > width) {
            this.position.x = 0;
        } else if (this.position.x + this.size.x / 2 < 0) {
            this.position.x = width;
        } else if (this.position.y - this.size.y / 2 > height) {
            this.position.y = 0;
        } else if (this.position.y + this.size.y / 2 < 0) {
            this.position.y = height;
        }
    }
    this.position.add(this.velocity);
};
// Damage target
Target.prototype.damage = function() {
    this.hitTime = millis();
    if (this.targetType === 0) {
        // Deal damage to static target
        this.health -= 20;
    } else if (this.targetType === 1) {
        // Deal damage to moving target
        this.health -= 15;
    } else if (this.targetType === 2) {
        // Deal damage to free moving target
        this.health -= 10;
    }
};

// Damage targets and add score
var updateTargets = function(targets) {
    var lifeTime = 8000;
    for (var t = 0; t < targets.length; t++) {
        for (var b = 0; b < bullets.length; b++) {
            // Detect collision
            if (bullets[b].pos.x > targets[t].position.x - targets[t].size.x / 2 && bullets[b].pos.x < targets[t].position.x + targets[t].size.x / 2 && bullets[b].pos.y > targets[t].position.y - targets[t].size.y / 2 && bullets[b].pos.y < targets[t].position.y + targets[t].size.y / 2) {
                // Detect if bullet has collided with target in previous frames
                var hitPrev = false;
                for (var i = 0; i < bullets[b].targetsHit.length; i++) {
                    if (bullets[b].targetsHit[i] === t) {
                        hitPrev = true;
                    }
                }
                if (hitPrev === false) {
                    targets[t].damage();
                    bullets[b].hitTarget = true;
                    bullets[b].targetsHit.push(t);
                    score += 5;
                    targetsHit++;
                }
            }
        }
        // Detect death
        if (targets[t].health <= 0 || millis() - targets[t].time >= lifeTime) {
            // Update score
            if (targets[t].health <= 0) {
                if (targets[t].targetType === 0) {
                    score += 10;
                } else if (targets[t].targetType === 2) {
                    score += 15;
                } else {
                    score += 20;
                }
            }
            // Destroy target
            targets.splice(t, t + 1);
        }
    }
};

// Spawn targets
var targetList = [new Target()];
var lastSpawn = millis();
var spawnTargets = function() {
    var numTargets = 3;
    var spawnInterval = 2000;
    if (targetList.length < numTargets && millis() - spawnInterval > lastSpawn) {
        // Spawn targets
        targetList.push(new Target());
        lastSpawn = millis();
    }
};
// Instance jet
var jet = new Jet();

// Draw background
var zOff = 0;
var drawBackground = function(color) {
    background(255, 255, 255);
    var chunks = 25;
    var xOff = 0;
    for (var x = 0; x < chunks; x++) {
        var yOff = 0;
        for (var y = 0; y < chunks; y++) {
            noStroke();
            var colorWeight = noise(xOff, yOff, zOff) * 400;
            fill(color, colorWeight);
            rect(x * (width / chunks), y * (height / chunks), width / chunks, height / chunks);
            yOff += 0.1;
        }
        xOff += 0.1;
    }
    zOff += 0.01;
};

// Run/Update game
draw = function() {
    drawBackground(color(47, 24, 102));
    // Update targets
    updateTargets(targetList, jet);
    spawnTargets();
    if (targetList.length > 0) {
        for (var i = 0; i < targetList.length; i++) {
            targetList[i].update();
            targetList[i].draw(color(255, 255, 255));
        }
    }
    
    // Update jet
    jet.move();
    jet.shoot();
    jet.update();
    jet.draw(color(199, 237, 255), color(255, 255, 255));
    
    // Draw HUD
    DrawHUD(jet, color(255, 255, 255), color(0, 0, 0));
};
