var canvas = document.getElementById("main");
// var music;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

var staticTexts = [
    {text: "We live on a                island of ignorance in", x: 100, y: 120, size: 40},
    {text: "the midst of black seas of infinity, and it", x: 140, y: 180, size: 40},
    {text: "was not meant that we should voyage far.", x: 180, y: 240, size: 40},
    {text: "- H.P. Lovecraft", x: 260, y: 300, size: 40}
];

var targetTexts = [
    {text: "placid", x: 1000, y: 500, size: 40}
];

var storedTextIndices = [];
var inventoryTexts = [];

const setNormalFontSettings = () => {
    c.font = "40px sans-serif";
    c.fillStyle = 'white';
};

const setNormalTexts = () => {
    setNormalFontSettings();
    for (let i = 0; i < staticTexts.length; i++) {
        let text = staticTexts[i];
        c.fillText(text.text, text.x, text.y);
    }
    for (let i = 0; i < targetTexts.length; i++) {
        let text = targetTexts[i];
        if (!storedTextIndices.includes(i)) {
            c.fillText(text.text, text.x, text.y);
        }
    }
};

var goals = [
    {x: 325, y: 65, width: 165, height: 80}
];

const setGoals = () => {
    c.fillStyle = `rgb(0,0,0)`;
    for (let i = 0; i < goals.length; i++) {
        let rect = goals[i];
        c.fillRect(rect.x, rect.y, rect.width, rect.height);
    }
};

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

    for(let i = 0; i < storedTextIndices.length; i++) {
        let text = targetTexts[storedTextIndices[i]];
        let textHeight = inventoryStartHeight + 100;

        if (i === 0 ) {
            if (!inventoryTexts[i]) {
                c.fillText(text.text, 80, textHeight);
            }
            else if (inventoryTexts[i] && !inventoryTexts[i].selected) {
                c.fillText(text.text, 80, textHeight);
            } else if (inventoryTexts[i] && inventoryTexts[i].selected){
                c.fillStyle = 'lightblue';
                c.fillText(text.text, 80, textHeight);
            }
            
            if (!inventoryTexts[i]) {
            inventoryTexts.push({
                text: text.text, 
                x: 80, 
                y: textHeight,
                width: c.measureText(text.text).width,
                selected: false});
            }
        }
        // Add logic for other texts and store these texts in inventory
    }
};

setNormalTexts();
setGoals();
setupInventory();

var mouse = {
    x: undefined, 
    y: undefined
};

var startX;
var startY;

const textHit = (x, y, textVar, textSize) => {
    let text = textVar;
    return (x >= text.x &&
        x <= text.x + c.measureText(text).width &&
        y >= text.y - textSize &&
        y <= text.y);
};

const handleMouseDown = (e) => {
    e.preventDefault();
    startX = mouse.x;
    startY = mouse.y;
    for (let i = 0; i < targetTexts.length; i++) {
        let text = targetTexts[i];
        if (textHit(startX, startY, text, 40)) {
            storedTextIndices.push(i);
            // Selection test
            console.log("Text Selected!");
            break;
        }
    }
    for (let i = 0; i < inventoryTexts.length; i++) {
        let text = inventoryTexts[i];
        if (textHit(startX, startY, text, 30)) {
            if (!text.selected) {
                text.selected = true;
            } else {
                text.selected = false;
            }
            // Selection test
            console.log(text.selected);
            break;
        } else {
            text.selected = false;
            console.log(text.selected);
        }
    }
};

const draw = () => {
    c.clearRect(0, 0, canvas.width, canvas.height);
    setNormalTexts();
    setGoals();
    setupInventory();
};

// done dragging
const handleMouseUp = (e) => {
    e.preventDefault();
    draw();
};

// const handleMouseOut = (e) => {
//     e.preventDefault();
//     textSelected = false;
// };

// handle mousemove events
const handleMouseMove = (e) => {
    e.preventDefault();
    mouse.x = e.x;
    mouse.y = e.y;

    // if(!textSelected) return;
    
    // var dx = mouse.x - startX;
    // var dy = mouse.y - startY;
    // startX = mouse.x;
    // startY = mouse.y;

    // word.x += dx;
    // word.y += dy;
    // draw();
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
// window.addEventListener('mouseout', (e) => {
//     handleMouseOut(e);
// });

// music = new Audio("sounds/backMusic.mp3");
// music.loop = true;
// music.load();
// music.play();