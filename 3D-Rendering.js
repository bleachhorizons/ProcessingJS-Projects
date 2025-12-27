// Setup
var backgroundColor = color(255, 255, 255);
var nodeColor = color(0, 140, 255);
var edgeColor = color(0, 0, 0);
var faceColor = color(44, 109, 201);
var faceColors = [color(255, 0, 0), color(100, 255, 100), color(100, 100, 255), color(255, 0, 255), color(255, 255, 0), color(0, 255, 255)];
var nodeSize = 0;
var edgeThickness = 0;

// Create cube function
var Cube = function(xLoc, yLoc, zLoc, xScale, yScale, zScale) {
    this.xLoc = xLoc;
    this.yLoc = yLoc;
    this.zLoc = zLoc;
    this.xScale = xScale;
    this.yScale = yScale;
    this.zScale = zScale;
    this.nodes = [
    [xScale + xLoc, yScale + yLoc, zScale + zLoc],
    [xScale + xLoc, -yScale + yLoc, zScale + zLoc],
    [-xScale + xLoc, -yScale + yLoc, zScale + zLoc],
    [-xScale + xLoc, yScale + yLoc, zScale + zLoc],
    [xScale + xLoc, yScale + yLoc, -zScale + zLoc],
    [xScale + xLoc, -yScale + yLoc, -zScale + zLoc],
    [-xScale + xLoc, -yScale + yLoc, -zScale + zLoc],
    [-xScale + xLoc, yScale + yLoc, -zScale + zLoc]
    ]; // Format: [x, y, z]
    this.edges = [
    [this.nodes[0][0], this.nodes[0][1], this.nodes[1][0], this.nodes[1][1]],
    [this.nodes[1][0], this.nodes[1][1], this.nodes[2][0], this.nodes[2][1]],
    [this.nodes[2][0], this.nodes[2][1], this.nodes[3][0], this.nodes[3][1]],
    [this.nodes[3][0], this.nodes[3][1], this.nodes[0][0], this.nodes[0][1]],
    [this.nodes[4][0], this.nodes[4][1], this.nodes[5][0], this.nodes[5][1]],
    [this.nodes[5][0], this.nodes[5][1], this.nodes[6][0], this.nodes[6][1]],
    [this.nodes[6][0], this.nodes[6][1], this.nodes[7][0], this.nodes[7][1]],
    [this.nodes[7][0], this.nodes[7][1], this.nodes[4][0], this.nodes[4][1]],
    [this.nodes[0][0], this.nodes[0][1], this.nodes[4][0], this.nodes[4][1]],
    [this.nodes[1][0], this.nodes[1][1], this.nodes[5][0], this.nodes[5][1]],
    [this.nodes[2][0], this.nodes[2][1], this.nodes[6][0], this.nodes[6][1]],
    [this.nodes[3][0], this.nodes[3][1], this.nodes[7][0], this.nodes[7][1]],
    ]; // Format: [x1, y1, x2, y2]
    this.faces = [
    [[this.nodes[0][0], this.nodes[0][1], this.nodes[0][2]], [this.nodes[1][0], this.nodes[1][1], this.nodes[1][2]], [this.nodes[2][0], this.nodes[2][1], this.nodes[2][2]], [this.nodes[3][0], this.nodes[3][1], this.nodes[3][2]]],
    [[this.nodes[4][0], this.nodes[4][1], this.nodes[4][2]], [this.nodes[5][0], this.nodes[5][1], this.nodes[5][2]], [this.nodes[6][0], this.nodes[6][1], this.nodes[6][2]], [this.nodes[7][0], this.nodes[7][1], this.nodes[7][2]]],
    [[this.nodes[4][0], this.nodes[4][1], this.nodes[4][2]], [this.nodes[5][0], this.nodes[5][1], this.nodes[5][2]], [this.nodes[1][0], this.nodes[1][1], this.nodes[1][2]], [this.nodes[0][0], this.nodes[0][1], this.nodes[0][2]]],
    [[this.nodes[7][0], this.nodes[7][1], this.nodes[7][2]], [this.nodes[6][0], this.nodes[6][1], this.nodes[6][2]], [this.nodes[2][0], this.nodes[2][1], this.nodes[2][2]], [this.nodes[3][0], this.nodes[3][1], this.nodes[3][2]]],
    [[this.nodes[6][0], this.nodes[6][1], this.nodes[6][2]], [this.nodes[5][0], this.nodes[5][1], this.nodes[5][2]], [this.nodes[1][0], this.nodes[1][1], this.nodes[1][2]], [this.nodes[2][0], this.nodes[2][1], this.nodes[2][2]]],
    [[this.nodes[7][0], this.nodes[7][1], this.nodes[7][2]], [this.nodes[4][0], this.nodes[4][1], this.nodes[4][2]], [this.nodes[0][0], this.nodes[0][1], this.nodes[0][2]], [this.nodes[3][0], this.nodes[3][1], this.nodes[3][2]]]
    ];
};

// Create order faces should be rendered
Cube.prototype.RenderOrder = function() {
    // Create list of total Z-values for each face
    var totalZList = [];
    for (var f = 0; f < this.faces.length; f++) {
        var totalZ = 0;
        for (var n = 0; n < this.faces[f].length; n++) {
            totalZ += this.faces[f][n][2];
        }
        totalZList.push(totalZ);
    }
    // Sort faces into list of their index order from least to greatest
    this.faceOrder = [];
    var numFound = false;
    var sorted = false;
    var i = 0;
    while (sorted === false) {
        while (numFound === false) {
            // Check if z-value at the "i" index is the smallest
            if (totalZList[i] <= totalZList[0] && totalZList[i] <= totalZList[1] && totalZList[i] <= totalZList[2] && totalZList[i] <= totalZList[3] && totalZList[i] <= totalZList[4] && totalZList[i] <= totalZList[5]) {
                this.faceOrder.push(i);
                totalZList[i] = 1000000000000000000000000000;
                i = 0;
                numFound = true;
            }
            else {
                i++;
            }
        }
        numFound = false;
        if (totalZList[0] === 1000000000000000000000000000 && totalZList[1] === 1000000000000000000000000000 && totalZList[2] === 1000000000000000000000000000 && totalZList[3] === 1000000000000000000000000000 && totalZList[4] === 1000000000000000000000000000 && totalZList[5] === 1000000000000000000000000000) {
            sorted = true;
        }
    }
};

// Draw Cube nodes and edges
Cube.prototype.Display = function() {
    // Update arrays
    this.edges = [
    [this.nodes[0][0], this.nodes[0][1], this.nodes[1][0], this.nodes[1][1]],
    [this.nodes[1][0], this.nodes[1][1], this.nodes[2][0], this.nodes[2][1]],
    [this.nodes[2][0], this.nodes[2][1], this.nodes[3][0], this.nodes[3][1]],
    [this.nodes[3][0], this.nodes[3][1], this.nodes[0][0], this.nodes[0][1]],
    [this.nodes[4][0], this.nodes[4][1], this.nodes[5][0], this.nodes[5][1]],
    [this.nodes[5][0], this.nodes[5][1], this.nodes[6][0], this.nodes[6][1]],
    [this.nodes[6][0], this.nodes[6][1], this.nodes[7][0], this.nodes[7][1]],
    [this.nodes[7][0], this.nodes[7][1], this.nodes[4][0], this.nodes[4][1]],
    [this.nodes[0][0], this.nodes[0][1], this.nodes[4][0], this.nodes[4][1]],
    [this.nodes[1][0], this.nodes[1][1], this.nodes[5][0], this.nodes[5][1]],
    [this.nodes[2][0], this.nodes[2][1], this.nodes[6][0], this.nodes[6][1]],
    [this.nodes[3][0], this.nodes[3][1], this.nodes[7][0], this.nodes[7][1]],
    ]; // Update edges
    this.faces = [
    [[this.nodes[0][0], this.nodes[0][1], this.nodes[0][2]], [this.nodes[1][0], this.nodes[1][1], this.nodes[1][2]], [this.nodes[2][0], this.nodes[2][1], this.nodes[2][2]], [this.nodes[3][0], this.nodes[3][1], this.nodes[3][2]]],
    [[this.nodes[4][0], this.nodes[4][1], this.nodes[4][2]], [this.nodes[5][0], this.nodes[5][1], this.nodes[5][2]], [this.nodes[6][0], this.nodes[6][1], this.nodes[6][2]], [this.nodes[7][0], this.nodes[7][1], this.nodes[7][2]]],
    [[this.nodes[4][0], this.nodes[4][1], this.nodes[4][2]], [this.nodes[5][0], this.nodes[5][1], this.nodes[5][2]], [this.nodes[1][0], this.nodes[1][1], this.nodes[1][2]], [this.nodes[0][0], this.nodes[0][1], this.nodes[0][2]]],
    [[this.nodes[7][0], this.nodes[7][1], this.nodes[7][2]], [this.nodes[6][0], this.nodes[6][1], this.nodes[6][2]], [this.nodes[2][0], this.nodes[2][1], this.nodes[2][2]], [this.nodes[3][0], this.nodes[3][1], this.nodes[3][2]]],
    [[this.nodes[6][0], this.nodes[6][1], this.nodes[6][2]], [this.nodes[5][0], this.nodes[5][1], this.nodes[5][2]], [this.nodes[1][0], this.nodes[1][1], this.nodes[1][2]], [this.nodes[2][0], this.nodes[2][1], this.nodes[2][2]]],
    [[this.nodes[7][0], this.nodes[7][1], this.nodes[7][2]], [this.nodes[4][0], this.nodes[4][1], this.nodes[4][2]], [this.nodes[0][0], this.nodes[0][1], this.nodes[0][2]], [this.nodes[3][0], this.nodes[3][1], this.nodes[3][2]]]
    ]; // Update faces
    
    // Draw faces
    this.RenderOrder();
    for (var i = 0; i < this.faceOrder.length; i++) {
        noStroke();
        var f = this.faceOrder[i];
        fill(faceColors[f]);
        quad(this.faces[f][0][0], this.faces[f][0][1], this.faces[f][1][0], this.faces[f][1][1], this.faces[f][2][0], this.faces[f][2][1], this.faces[f][3][0], this.faces[f][3][1]);
    }
    
    // Draw edges
    stroke(edgeColor);
    if (edgeThickness > 0) {
        strokeWeight(edgeThickness);
    }
    else {
        noStroke();
    }
    for (var e = 0; e < this.edges.length; e++) {
        line(this.edges[e][0], this.edges[e][1], this.edges[e][2], this.edges[e][3]);
    }
    
    // Draw nodes
    noStroke();
    fill(nodeColor);
    for (var n = 0; n < this.nodes.length; n++) {
        ellipse(this.nodes[n][0], this.nodes[n][1], nodeSize, nodeSize);
    }
};

// Rotate cube on x-axis
Cube.prototype.RotateX = function(theta) {
    for (var n = 0; n < this.nodes.length; n++) {
        var y = this.nodes[n][1];
        var z = this.nodes[n][2];
        this.nodes[n][1] = y * cos(theta) - z * sin(theta);
        this.nodes[n][2] = y * sin(theta) + z * cos(theta);
    }
};
// Rotate cube on y-axis
Cube.prototype.RotateY = function(theta) {
    for (var n = 0; n < this.nodes.length; n++) {
        var x = this.nodes[n][0];
        var z = this.nodes[n][2];
        this.nodes[n][0] = x * cos(theta) - z * sin(theta);
        this.nodes[n][2] = x * sin(theta) + z * cos(theta);
    }
};
// Rotate cube on z-axis
Cube.prototype.RotateZ = function(theta) {
    for (var n = 0; n < this.nodes.length; n++) {
        var x = this.nodes[n][0];
        var y = this.nodes[n][1];
        this.nodes[n][0] = x * cos(theta) - y * sin(theta);
        this.nodes[n][1] = x * sin(theta) + y * cos(theta);
    }
};

// Initialize cube
var rectangularPrism = new Cube(0, 0, 0, 100, 100, 100);
var xTheta = 0;
var yTheta = 0;
var zTheta = 0;
var prevX = xTheta;
var prevY = yTheta;
var prevZ = zTheta;

var draw = function() {
    // Setup
    pushMatrix();
    translate(200, 200); // Move origin to center
    background(backgroundColor);
    
    // Rotate Cube
    rectangularPrism.RotateX(prevX - xTheta);
    prevX = xTheta;
    xTheta = 45;
    rectangularPrism.RotateY(prevY - yTheta);
    prevY = yTheta;
    yTheta = 45;
    rectangularPrism.RotateZ(prevZ - zTheta);
    prevZ = zTheta;
    zTheta = 22.5;

    // Display prism
    rectangularPrism.Display();
    popMatrix(); // Reset matrix
};
