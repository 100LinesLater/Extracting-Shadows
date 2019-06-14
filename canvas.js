var canvas = document.getElementById("main");

// Audio element
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

const audioElement = document.querySelector('audio');
const track = audioContext.createMediaElementSource(audioElement);

track.connect(audioContext.destination);

// State of music. Start with no music playing
var playing = false;

// Set canvas height and width properties to full screen 
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Set context
var c = canvas.getContext('2d');

// Mouse location
var mouse = {
    x: undefined,
    y: undefined
};

// X and Y coordinates. Will be used in canvas functions
var startX = 500;
var startY = 500;

var currentLevel = 0;
var levelTime = 1000;

// Setup for each level
var levelDetails = {
    1: {
        staticTexts: [
            { text: "We live on a placid island of ignorance in", x: 100, y: 120, size: 40 },
            { text: "the midst of black seas of infinity, and it", x: 140, y: 180, size: 40 },
            { text: "was not meant that we should voyage far.", x: 180, y: 240, size: 40 },
            { text: "- H.P. Lovecraft", x: 260, y: 300, size: 40 }
        ],
        targetTexts: [
            { text: "placid", x: 1000, y: 500, size: 40 },
            { text: "black", x: 100, y: 50, size: 40 }
        ], 
        goals: [
            { x: 328, y: 80, width: 110, height: 50, target: "placid" },
            { x: 355, y: 140, width: 100, height: 50, target: "black" }
        ], 
        nextLevelButton: { text: "Next level", x: 400, y: 400, width: 200, height: 40, size: 40 }
    },
    2: {
        staticTexts: [
            { text: "Humanity has the stars in its future, and that future", x: 200, y: 220, size: 40 },
            { text: "is too important to be lost under the burden", x: 240, y: 280, size: 40 },
            { text: "of juvenile folly and ignorant superstition.", x: 280, y: 340, size: 40 },
            { text: "- Isaac Asimov", x: 360, y: 400, size: 40 }
        ],
        targetTexts: [
            { text: "stars", x: 300, y: 500, size: 30 },
            { text: "folly", x: 500, y: 50, size: 30 },
            { text: "error", x: 100, y: 150, size: 30 },
        ],
        goals: [
            { x: 520, y: 180, width: 90, height: 50, target: "stars" },
            { x: 460, y: 295, width: 85, height: 60, target: "folly" }
        ],
        nextLevelButton: { text: "Next level", x: 200, y: 100, width: 200, height: 40, size: 40 }
    },
    3: {
        staticTexts: [
            { text: "The bird fights its way out of the egg.", x: 150, y: 120, size: 40 },
            { text: "The egg is the world.", x: 110, y: 180, size: 40 },
            { text: "Who would be born must first destroy a world.", x: 70, y: 240, size: 40 },
            { text: "- Herman Hesse", x: 110, y: 300, size: 40 }
        ],
        targetTexts: [
            { text: "bird", x: 900, y: 500, size: 30 },
            { text: "fish", x: 50, y: 450, size: 30 },
            { text: "dinosaur", x: 500, y: 400, size: 30 },
            { text: "Herman", x: 1000, y: 50, size: 30 },
            { text: "Anton", x: 600, y: 180, size: 30 },
        ],
        goals: [
            { x: 220, y: 80, width: 90, height: 50, target: "bird" },
            { x: 130, y: 260, width: 150, height: 60, target: "Herman" }
        ],
        nextLevelButton: { text: "Next level", x: 200, y: 400, width: 200, height: 40, size: 40 }
    },
    4: {
        staticTexts: [
            { text: "Life and death appeared to me ideal bounds,", x: 200, y: 220, size: 40 },
            { text: "which I should first break through,", x: 240, y: 280, size: 40 },
            { text: "and pour a torrent of light into our dark world.", x: 280, y: 340, size: 40 },
            { text: "- Mary Shelley", x: 360, y: 400, size: 40 }
        ],
        targetTexts: [
            { text: "bounds", x: 800, y: 80, size: 30 },
            { text: "limits", x: 50, y: 100, size: 30 },
            { text: "torrent", x: 210, y: 550, size: 30 },
            { text: "flood", x: 680, y: 400, size: 30 },
            { text: "light", x: 800, y: 600, size: 30 },
            { text: "water", x: 1100, y: 270, size: 30 },
        ],
        goals: [
            { x: 850, y: 180, width: 133, height: 50, target: "bounds" },
            { x: 470, y: 300, width: 140, height: 50, target: "torrent" },
            { x: 645, y: 300, width: 93, height: 60, target: "light" },
        ],
        nextLevelButton: { text: "Next level", x: 200, y: 100, width: 200, height: 40, size: 40 }
    }
};

var storedTextIndices = [];
var inventoryTexts = [];
var tempText = undefined;

const setNormalFontSettings = () => {
    c.font = "40px sans-serif";
    c.fillStyle = 'white';
};

// Display full quote and target words
const setQuote = (lvl) => {
    setNormalFontSettings();
    let texts = levelDetails[lvl].staticTexts;
    for (let i = 0; i < texts.length; i++) {
        let text = texts[i];
        c.fillText(text.text, text.x, text.y);
    }
}
const setTargets = (lvl) => {
    let targets = levelDetails[lvl].targetTexts;
    for (let i = 0; i < targets.length; i++) {
        let text = targets[i];
        c.font = `${text.size}px sans-serif`;
        c.fillText(text.text, text.x, text.y);
    }
};

// Cover target word goals with mask
const setGoals = (lvl) => {
    c.fillStyle = `rgb(32,32,32)`;
    let goals = levelDetails[lvl].goals;
    for (let i = 0; i < goals.length; i++) {
        let rect = goals[i];
        c.fillRect(rect.x, rect.y, rect.width, rect.height);
    }
};

// Other clickable text and images
var playButton = {
    text: "Play/Pause", x: canvas.width - 200,
    y: canvas.height * 0.8 + 40, size: 30
};
var instructionsButton = {
    text: "Instructions", x: canvas.width - 500,
    y: canvas.height * 0.8 + 40, size: 30
};
var githubImage = {
    source: './images/GitHub.png', x: canvas.width - 200,
    y: canvas.height - 80, width: 64, height: 64, 
    link: 'https://github.com/100LinesLater'
};
var linkedinImage = {
    source: './images/linkedin.png', x: canvas.width - 120,
    y: canvas.height - 80, width: 64, height: 64,
    link: 'https://www.linkedin.com/in/yoni-hartmayer'
};

// Draws inventory section on the bottom of the page
const setupInventory = () => {
    let inventoryHeight = canvas.width * 0.2;
    let inventoryStartHeight = canvas.height * 0.8;

    c.fillStyle = 'rgb(0, 0, 0)';
    c.fillRect(0, inventoryStartHeight, canvas.width, inventoryHeight);

    c.strokeStyle = 'white';
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(0, inventoryStartHeight);
    c.lineTo(canvas.width, inventoryStartHeight);
    c.stroke();
    c.closePath();

    c.fillStyle = 'white';
    c.font = "30px sans-serif";
    c.fillText("Inventory:", 20, inventoryStartHeight + 40);
    c.fillText(playButton.text, playButton.x, playButton.y);
    c.fillStyle = 'light blue';
    c.fillText(instructionsButton.text, instructionsButton.x, instructionsButton.y);

    let githubImg = new Image();
    let img1 = githubImage;
    githubImg.src = img1.source;
    c.drawImage(githubImg, img1.x, img1.y, img1.width, img1.height);

    let linkedinImg = new Image();
    let img2 = linkedinImage;
    linkedinImg.src = img2.source;
    c.drawImage(linkedinImg, img2.x, img2.y, img2.width, img2.height);

    let textHeight = (inventoryStartHeight + canvas.height) / 2 + 20;

    // Renders found words and selected words
    if (inventoryTexts.length === 0 && tempText !== undefined) {
        let text = tempText;
        c.fillText(text.text, 80, textHeight);
        inventoryTexts.push({
            text: text.text,
            x: 80,
            y: textHeight,
            width: c.measureText(text.text).width,
            selected: false
        });
    } else if (inventoryTexts.length > 0) {
        for (let i = 0; i < inventoryTexts.length; i++) {
            let text = inventoryTexts[i];

            if (text.selected) {
                c.fillStyle = 'lightblue';
                c.fillText(text.text, text.x, text.y);
            } else {
                c.fillStyle = 'white';
                c.fillText(text.text, text.x, text.y);
            }
        }
        if (tempText) {
            let text = tempText;
            let prevText = inventoryTexts[inventoryTexts.length - 1];
            let textXLocation = prevText.x + prevText.width + 50;

            c.fillStyle = 'white';
            c.fillText(text.text, textXLocation, textHeight);

            inventoryTexts.push({
                text: text.text,
                x: textXLocation,
                y: textHeight,
                width: c.measureText(text.text).width,
                selected: false
            });
        }
    }
    tempText = undefined;

};

// Sets radius of circle around cursor
const setSearchLight = (size) => {
    c.fillStyle = "black";
    c.beginPath();
    c.arc(mouse.x, mouse.y, size, 0, 2 * Math.PI);
    c.rect(canvas.width, 0, -(canvas.width), canvas.height);
    c.fill();
};

var instructionsOn = true;
var firstTimeInstructions = true;
var instructionsDifficulties = [
    {text: "Easy", x: 0, y: 0, size: 30, searchlightSize: 70},
    { text: "Medium", x: 0, y: 0, size: 30, searchlightSize: 50},
    { text: "Hard", x: 0, y: 0, size: 30, searchlightSize: 30}
];
var currentDifficulty = 55;

// Renders instructions
const loadInstructions = () => {
    c.fillStyle = "black";
    c.beginPath();
    c.rect(0, 0, canvas.width, canvas.height);
    c.fill();

    c.fillStyle = "white";
    c.font = "40px sans-serif";
    c.fillText("Welcome to the world of Extracting Shadows.", canvas.width / 7, canvas.height / 5);
    c.font = "30px sans-serif";
    c.fillText("- Search amongst the darkness to find the missing words to complete the quote.", canvas.width / 7, canvas.height / 5 + 50);
    c.fillText("- Once found, select a word from your inventory and click on the place it belongs.", canvas.width / 7, canvas.height / 5 + 90);

    // Different messages on screen depending on if first time view or not
    if (firstTimeInstructions) {
        c.fillText("Select a difficulty:", canvas.width / 3, canvas.height / 5 + 150);

        for (let i = 0; i < instructionsDifficulties.length; i++) {
            c.fillText(instructionsDifficulties[i].text, canvas.width / 3 + 80, canvas.height / 5 + 210 + (60 * i));
            instructionsDifficulties[i].x = canvas.width / 3 + 80;
            instructionsDifficulties[i].y = canvas.height / 5 + 210 + (60 * i); 
        }
    } else {
        c.fillText("Click anywhere to return to game.", canvas.width / 3, canvas.height / 5 + 300);
    }
};

loadInstructions();

// Logic to determine if text is clicked
const textHit = (x, y, textVar, textSize) => {
    let text = textVar;
    return (x >= text.x &&
        x <= text.x + c.measureText(text).width - 90 &&
        y >= text.y - textSize &&
        y <= text.y);
};

// Logic to determine if rectangle or image is clicked
const goalHit = (x, y, rectangleVar) => {
    let rect = rectangleVar;
    return (x >= rect.x &&
        x <= rect.x + rect.width &&
        y <= rect.y + rect.height &&
        y >= rect.y);
};

audioElement.addEventListener('ended', () => {
    playing = false;
}, false);

const handleMouseDown = (e) => {
    e.preventDefault();
    // Mouse Position on click
    startX = mouse.x;
    startY = mouse.y;

    // Go to game if instructions are loaded
    if (instructionsOn && firstTimeInstructions) {
        // Check if difficulty has been selected and assign difficulty settings
        let difficultySelected = false;
        currentLevel++;

        for (let i = 0; i < instructionsDifficulties.length; i++) {
            let text = instructionsDifficulties[i];
            if (textHit(startX, startY, text, text.size)) {
                difficultySelected = true;
                currentDifficulty = text.searchlightSize;
            }
        }
        
        if (difficultySelected) {
            audioElement.play();
            playing = true;
            firstTimeInstructions = false;
            instructionsOn = false;
        }
    } else if (instructionsOn) {
        // Do nothing game related if instructions are loaded
        instructionsOn = false;
    } else if (levelDetails[currentLevel].goals.length === 0) {
        // Next level logic
        let text = levelDetails[currentLevel].nextLevelButton;
        if (textHit(startX, startY, text, text.size)) {
            currentLevel++;
        }
    } else {

    // Check if a goal area has been selected
    let goals = levelDetails[currentLevel].goals;
    for (let i = 0; i < goals.length; i++) {
        let goal = goals[i];
        if (goalHit(startX, startY, goal) && inventoryTexts.length > 0) {
            
            // Check if matching inventory text has been selected
            for (let j = 0; j < inventoryTexts.length; j++) {
                let text = inventoryTexts[j];
                if (text.text === goal.target && text.selected) {
                    levelDetails[currentLevel].goals.splice(i, 1);
                    inventoryTexts.splice(j, 1);
                }
            }
        }
    }
    // Check if a target text has been selected
    let targets = levelDetails[currentLevel].targetTexts;
    for (let i = 0; i < targets.length; i++) {
        let text = targets[i];
        if (textHit(startX, startY, text, 40)) {
            storedTextIndices.push(i);
            tempText = targets[i];
            levelDetails[currentLevel].targetTexts.splice(i, 1);
            // Selection test
            // console.log("Text Selected!");
            break;
        }
    }
    // Check if an inventory text has been selected
    for (let i = 0; i < inventoryTexts.length; i++) {
        let text = inventoryTexts[i];
        if (textHit(startX, startY, text, 30)) {
            if (!text.selected) {
                text.selected = true;
            } else {
                text.selected = false;
            }
            // Selection test
            // console.log(text.selected);
        } else {
            text.selected = false;
            // Selection test
            // console.log(text.selected);
        }
    }
    // Check if play / pause music is selected
    if (textHit(startX, startY, playButton, 30)) {
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        // play or pause track depending on state
        if (!playing) {
            audioElement.play();
            playing = true;
        } else if (playing) {
            audioElement.pause();
            playing = false;
        }
    }
    // Check if instructions button is clicked
    if (textHit(startX, startY, instructionsButton, instructionsButton.size)) {
        instructionsOn = true;
        loadInstructions();
    }
    // Check if Github or LinkedIn links are clicked
    if (goalHit(startX, startY, linkedinImage)) {
        window.open(linkedinImage.link);
    }
    if (goalHit(startX, startY, githubImage)) {
        window.open(githubImage.link);
    }
    }
};

const draw = () => {
    c.clearRect(0, 0, canvas.width, canvas.height);

    // Level and game win condition check
    if (currentLevel > Object.keys(levelDetails).length) {
        c.fillText("Congratulations, you've finished all the current levels.", 200, 200);
        c.fillText("Stay tuned for more updates.", 200, 250);
    } else if (levelDetails[currentLevel].goals.length === 0) {
        inventoryTexts = [];
        setQuote(currentLevel);
        let button = levelDetails[currentLevel].nextLevelButton;
        c.fillText(button.text, button.x, button.y);
    } else {
        setQuote(currentLevel);
        setTargets(currentLevel);
        setGoals(currentLevel);
        setSearchLight(currentDifficulty);
        setupInventory();
    }
};

const handleMouseUp = (e) => {
    e.preventDefault();
    if (!instructionsOn) {
        draw();
    }
};

// handle mousemove events
const handleMouseMove = (e) => {
    e.preventDefault();
    mouse.x = e.x;
    mouse.y = e.y;
    if (!instructionsOn) {
        draw();
    }
};

// listen for mouse events
window.addEventListener('mousemove', (e) => {
    handleMouseMove(e);
});
window.addEventListener('mousedown', (e) => {
    handleMouseDown(e);
});
window.addEventListener('mouseup', (e) => {
    handleMouseUp(e);
});