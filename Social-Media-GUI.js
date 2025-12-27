/*** This is a presentation of a social media account page and selector, it is very rough and has a few minor bugs ***/
/*** Click the three lines to pull up the profile selector, then select a profile and enjoy! You can also click the follow button to see the number of followers go up and down ***/

// Variables
var onProfile = true; // Checks what scene is selected
var selectedProfile = 0; // Indexes what profile is selected
var menuX = 0; // The location of the menu (on the x axis)
var menuY = 0; // The location of the menu (on the y axis)
var targetMenuX = 0; // The target location (where it should be) for the menu
var backgroundColor = 255; // Background color
var clickedFollow = false; // Detects whether follow button was clicked
var clickedMenu = false;
var wasFollowed = false; // Detects if user was followed before calculating values (for followerCounter)
var userProfiles = [
    {
    firstInitial: 'E',
    displayName: "Edore",
    userID: "edore365",
    biography: "Hi, I'm Edore and I love cars and coding!",
    followers: 6,
    following: 34,
    posts: 0,
    upvotes: 0,
    isFollowed: false,
    color: color(204, 0, 0)
    },
    {
    firstInitial: 'S',
    displayName: "Sus",
    userID: "therealrealsussysusser",
    biography: "(￢‿￢ )",
    followers: 68,
    following: 420,
    posts: 69,
    upvotes: 420,
    isFollowed: false,
    color: color(204, 0, 204)
    },
    {
    firstInitial: 'R',
    displayName: "RadDad",
    userID: "rad_dad435",
    biography: "The coolest dad of ALL dads B)",
    followers: 71,
    following: 3478,
    posts: 3,
    upvotes: 2,
    isFollowed: false,
    color: color(0, 145, 255)
    },
    {
    firstInitial: 'F',
    displayName: "Famous?",
    userID: "that1famousguy",
    biography: "Just a really famous dude.",
    followers: 74544571,
    following: 129,
    posts: 432,
    upvotes: 1234234557,
    isFollowed: true,
    color: color(255, 255, 0)
    }
]; // Stores user information in objects of arrays

var DisplayProfile = function(user) {
    /*** DRAW TOP ***/
    var topX = 200;
    var topY = 100;
    // Draw profile picture
    strokeWeight(5);
    stroke(46, 46, 46);
    fill(user.color);
    ellipse(topX - 80, topY, 100, 100); // Draw circle
    textAlign(CENTER, CENTER);
    textFont(createFont("monospace"), 87);
    fill(59, 59, 59);
    text(user.firstInitial, topX - 80, topY); // Profile-Picture letter
    // Draw display name
    textFont(createFont("sans-serif"), 44);
    textAlign(LEFT, CENTER);
    fill(0, 0, 0);
    text(user.displayName, topX - 15, topY);
    // Draw user-identification name
    textSize(15);
    fill(153, 153, 153);
    text("@" + user.userID, topX - 15, topY + 35);
    
    
    /*** DRAW MID ***/
    var midX = 200;
    var midY = 200;
    // Draw "about me" section
    textAlign(CENTER, BASELINE);
    textFont(createFont("sans-serif"), 20);
    fill(0, 0, 0);
    text("About me", midX, midY - 15);
    textSize(15);
    fill(61, 61, 61);
    text(user.biography, midX, midY + 7);
    // Draw following/followers
    var following = [" following", midX / 1.5, midY + 34];
    var followers = [" followers", midX * 1.3333, midY + 34];
    fill(156, 156, 156);
    textFont(createFont("cursive"), 13);
    // Draw following
    if(user.following >= 1000000000) {
        text((round(user.following/100000000))/10 + "B" + following[0], following[1], following[2]);
    }
    else if(user.following >= 1000000) {
        text((round(user.following/100000))/10 + "M" + following[0], following[1], following[2]);
    }
    else if(user.following >= 1000) {
        text((round(user.following/100))/10 + "K" + following[0], following[1], following[2]);
    }
    else {
        text(user.following + following[0], following[1], following[2]);
    }
    // Draw followers
        if(user.followers >= 1000000000) {
        text((round(user.followers/100000000))/10 + "B" + followers[0], followers[1], followers[2]);
    }
    else if(user.followers >= 1000000) {
        text((round(user.followers/100000))/10 + "M" + followers[0], followers[1], followers[2]);
    }
    else if(user.followers >= 1000) {
        text((round(user.followers/100))/10 + "K" + followers[0], followers[1], followers[2]);
    }
    else {
        text(user.followers + followers[0], followers[1], followers[2]);
    }
    // Follow Button
    var follow = {
        sizeX: 329,
        sizeY: 43,
        roundness: 25,
        followColor: color(76, 118, 245),
        followedColor: color(255, 255, 255),
        followHoverColor: color(30, 70, 179),
        followedHoverColor: color(143, 143, 143),
        followClickedColor: color(21, 47, 112),
        followedClickedColor: color(74, 74, 74),
        followText: "Follow",
        followedText: "Followed"
    };
    // Button Logic
    var hover;
    var clicking;
    if(mouseX > midX - (follow.sizeX / 2) && mouseX < midX + (follow.sizeX / 2) && mouseY > (midY + 77) - (follow.sizeY / 2) && mouseY < (midY + 77) + (follow.sizeY / 2)) {
        hover = true;
        if(mouseIsPressed === true && mouseButton === LEFT) {
            clickedFollow = true;
            clicking = true;
        }
        else {
            clicking = false;
        }
        if(mouseIsPressed === false && clickedFollow === true) {
            clickedFollow = false;
            
            if(user.isFollowed === true) {
                user.isFollowed = false;
            }
            else {
                user.isFollowed = true;
            }
        }
    }
    else {
        hover = false;
    }
    // Setup to draw button
    rectMode(CENTER);
    textFont(createFont("sans-serif"), 27);
    textAlign(CENTER, CENTER);
    // Draw Button
    if(user.isFollowed === false) {
        noStroke();
        fill(follow.followColor);
        rect(midX, midY + 77, follow.sizeX, follow.sizeY, follow.roundness); // Follow box
        fill(follow.followedColor);
        text(follow.followText, midX, midY + 77); // Follow text
        if(hover === true) {
            // Update Button (hovering)
            fill(follow.followHoverColor);
            rect(midX, midY + 77, follow.sizeX, follow.sizeY, follow.roundness); // Follow box
            fill(follow.followedHoverColor);
            text(follow.followText, midX, midY + 77); // Follow text
        } // Mouse hovering over Button
        if(clicking === true) {
            // Update Button (clicking)
            fill(follow.followClickedColor);
            rect(midX, midY + 77, follow.sizeX, follow.sizeY, follow.roundness); // Follow box
            fill(follow.followedClickedColor);
            text(follow.followText, midX, midY + 77); // Follow text
        } // Mouse clicking button
    } // Display follow button
    else {
        strokeWeight(3);
        stroke(follow.followColor);
        fill(follow.followedColor);
        rect(midX, midY + 77, follow.sizeX, follow.sizeY, follow.roundness); // Followed box
        fill(follow.followColor);
        text(follow.followedText, midX, midY + 77); // Followed text
        if(hover === true) {
            // Update Button (hovering)
            fill(follow.followedHoverColor);
            rect(midX, midY + 77, follow.sizeX, follow.sizeY, follow.roundness); // Followed box
            fill(follow.followHoverColor);
            text(follow.followedText, midX, midY + 77); // Followed text
        } // Mouse hovering over button
        if(clicking === true) {
            // Update Button (clicking)
            fill(follow.followedClickedColor);
            rect(midX, midY + 77, follow.sizeX, follow.sizeY, follow.roundness); // Follow box
            fill(follow.followClickedColor);
            text(follow.followedText, midX, midY + 77); // Follow text
        } // Mouse clicking button
    } // Display followed button
    
    
    /*** DRAW BOT ***/
    // Draw Post
    var botX = 100;
    var botY = 300;
    textFont(createFont("san-serif"), 22);
    textAlign(LEFT, BOTTOM);
    fill(31, 31, 31);
    // Draw Posts
    if(user.posts >= 1000000000) {
        text((round(user.posts/100000000))/10 + "B posts", botX - 91, botY + 65);
    }
    else if(user.posts >= 1000000) {
        text((round(user.posts/100000))/10 + "M posts", botX - 91, botY + 65);
    }
    else if(user.posts >= 1000) {
        text((round(user.posts/100))/10 + "K posts", botX - 91, botY + 65);
    }
    else {
        text(user.posts + " posts", botX - 91, botY + 65);
    }
    // Draw Upvotes
    if(user.upvotes >= 1000000000) {
        text((round(user.upvotes/100000000))/10 + "B upvotes", botX - 91, botY + 92);
    }
    else if(user.upvotes >= 1000000) {
        text((round(user.upvotes/100000))/10 + "M upvotes", botX - 91, botY + 92);
    }
    else if(user.upvotes >= 1000) {
        text((round(user.upvotes/100))/10 + "K upvotes", botX - 91, botY + 92);
    }
    else {
        text(user.upvotes + " upvotes", botX - 91, botY + 92);
    }
}; // Display Profile

var DisplayMenu = function(users) {
    // Setup
    noStroke();
    rectMode(LEFT);
    fill(255, 255, 255); // Menu Color
    rect(menuX, menuY, 346, 400);
    // Draw users
    for(var i = 0; i < users.length; i++) {
        noStroke();
        fill(users[i].color); // Profile-picture color
        ellipse(menuX + 51, menuY + 61 + (i * 65), 45, 45); // Profile-picture circle
        fill(194, 194, 194); // Person color
        ellipse(menuX + 51, menuY + 57 + (i * 65), 15, 15); // Person Head
        arc(menuX + 51, menuY + 84 + (i * 65), 24, 34, -168, -12); // Profile-picture shoulders
        arc(menuX + 51, menuY + 69 + (i * 65), 39, 30, -306, -236); // Profile-picture body (clipping adjustments)
        textFont(createFont("monospace"), 22); // Font, display name text size
        textAlign(LEFT, CENTER);
        fill(0, 0, 0); // Display name color
        text(users[i].displayName, menuX + 85, menuY + 56 + (i * 63)); // Draw Display name
        textSize(13); // User ID text size
        fill(145, 145, 145); // User ID color
        text("@" + users[i].userID, menuX + 85, menuY + 75 + (i * 63)); // Draw User ID
        // Button Logic
        if(onProfile === false) {
            if(mouseX > menuX + 14 && mouseX < menuX + 329 && mouseY > menuY + 28 + (i * 65) && mouseY < menuY + 90 + (i * 65)) {
                stroke(46, 46, 46);
                strokeWeight(5);
                noFill();
                rect(menuX + 14, menuY + 28 + (i * 65), 315, 65);
                if(mouseIsPressed) {
                    onProfile = true;
                    selectedProfile = i;
                } // Detect if and what profile was pressed
            } // Detect what profile mouse is hovering on
        } // Detect what screen is selected
    }
};

// Counts followers for follow button
var followerCounter = function(users) {
    if(users[selectedProfile].isFollowed === true && wasFollowed === false) {
        users[selectedProfile].followers++;
        wasFollowed = true;
    }
    else if (wasFollowed === true && users[selectedProfile].isFollowed === false) {
        users[selectedProfile].followers--;
        wasFollowed = false;
    }
}; // Calculates number of followers when follow button is activated or deactivated

var draw = function() {
    background(backgroundColor, backgroundColor, backgroundColor); // Draw background
    /*** Draw/select scenes ***/
    // Display Profile screen
    if(onProfile === true) {
        // Update background color
        while(backgroundColor < 255) {
            backgroundColor += 1;
            if(backgroundColor < 255) {
                backgroundColor = 255;
            }
        }
        // Update Menu box
        while(menuX > -346) {
            menuX -= 1;
            if(menuX < -346) {
                menuX = -346;
            }
        }
        DisplayProfile(userProfiles[selectedProfile]); // Draw profile screen
    }
    // Display Menu screen
    else {
        // Update background color
        while(backgroundColor > 200) {
            backgroundColor -= 1;
            if(backgroundColor < 200) {
                backgroundColor = 200;
            }
        }
        // Update Menu box
        while(menuX < targetMenuX) {
            menuX += 1;
            if(menuX > targetMenuX) {
                menuX = targetMenuX;
            }
        }
        DisplayMenu(userProfiles); // Display Menu screen
    }
    // Draw Menu/Profile toggle button
    for(var i = 0; i < 3; i++) {
        stroke(0, 0, 0);
        strokeWeight(2);
        line(14, 10 + i * 6, 42, 10 + i * 6);
    }
    // Draw Menu/Profile toggle button logic
    if(mouseX > 14 && mouseX < 44 && mouseY > 10 && mouseY < 26) {
        // Setup
        stroke(0, 0, 0);
        strokeWeight(1);
        // Draw hover for profile screen
        if(onProfile === true) {
            fill(232, 232, 232); // Pop-up box color
            rect(66, 15, 30, 14); // Pop-up box
            fill(0, 0, 0); // Text color
            textFont(createFont("san-serif"), 10);
            text("Menu" , 54, 21); // Draw Pop-up text
            // If clicked statement
            if(mouseIsPressed && mouseButton === LEFT && clickedMenu === false) {
                onProfile = false;
                clickedMenu = true;
            }
        }
        // Draw hover for menu screen
        else {
            fill(232, 232, 232); // Pop-up box color
            rect(52, 9, 42, 14); // Pop-up box
            fill(0, 0, 0); // Text color
            textFont(createFont("san-serif"), 10);
            text("Go back" , 55, 16); // Draw Pop-up text
            // If clicked statement
            if(mouseIsPressed && mouseButton === LEFT && clickedMenu === false) {
                onProfile = true;
                clickedMenu = true;
            }
        }
    }
    // If clicked outside of menu box
    if(mouseIsPressed && onProfile === false && mouseX > 346) {
        onProfile = true;
    }
    followerCounter(userProfiles); // Run follower counter function
    // Detects if menu button was clicked
    if(mouseIsPressed === false) {
        clickedMenu = false;
    }
};
