var canvas = document.getElementById("main");
// var music;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

// Mouse location
var mouse = {
    x: undefined,
    y: undefined
};

var startX = 500;
var startY = 500;

var staticTexts = [
    {text: "We live on a placid island of ignorance in", x: 100, y: 120, size: 40},
    {text: "the midst of black seas of infinity, and it", x: 140, y: 180, size: 40},
    {text: "was not meant that we should voyage far.", x: 180, y: 240, size: 40},
    {text: "- H.P. Lovecraft", x: 260, y: 300, size: 40}
];

var targetTexts = [
    {text: "placid", x: 1000, y: 500, size: 40},
    {text: "black", x: 100, y: 50, size: 40}
];

var storedTextIndices = [];
var inventoryTexts = [];
var tempText = undefined;

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
        c.fillText(text.text, text.x, text.y);
    }
};

var goals = [
    {x: 328, y: 80, width: 110, height: 50, target: "placid"},
    {x: 355, y: 140, width: 100, height: 50, target: "black"}
];

const setGoals = () => {
    c.fillStyle = `rgb(32,32,32)`;
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

    let textHeight = inventoryStartHeight + 100;

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

const setSearchLight = () => {
    c.fillStyle = "black";
    c.beginPath();
    c.arc(mouse.x, mouse.y, 50, 0, 2 * Math.PI);
    c.rect(canvas.width, 0, -(canvas.width), canvas.height);
    c.fill();
};

setNormalTexts();
setGoals();
setSearchLight();
setupInventory();

const textHit = (x, y, textVar, textSize) => {
    let text = textVar;
    return (x >= text.x &&
        x <= text.x + c.measureText(text).width - 100 &&
        y >= text.y - textSize &&
        y <= text.y);
};

const goalHit = (x, y, rectangleVar) => {
    let rect = rectangleVar;
    return (x >= rect.x &&
        x <= rect.x + rect.width &&
        y <= rect.y + rect.height &&
        y >= rect.y);
};

const handleMouseDown = (e) => {
    e.preventDefault();
    // Mouse Position on click
    startX = mouse.x;
    startY = mouse.y;
    // Check if a goal area has been selected
    for (let i = 0; i < goals.length; i++) {
        let goal = goals[i];
        if (goalHit(startX, startY, goal) && inventoryTexts.length > 0) {
            
            // Check if matching inventory text has been selected
            for (let j = 0; j < inventoryTexts.length; j++) {
                let text = inventoryTexts[j];
                if (text.text === goal.target && text.selected) {
                    goals.splice(i, 1);
                    inventoryTexts.splice(j, 1);
                }
            }
        }
    }
    // Check if a target text has been selected
    for (let i = 0; i < targetTexts.length; i++) {
        let text = targetTexts[i];
        if (textHit(startX, startY, text, 40)) {
            storedTextIndices.push(i);
            tempText = targetTexts[i];
            targetTexts.splice(i, 1);

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
};

const draw = () => {
    c.clearRect(0, 0, canvas.width, canvas.height);

    // Normal re-render
    if (goals.length > 0) {
        setNormalTexts();
        setGoals();
        setSearchLight();
        setupInventory();
    }
    // Win condition met
    else {
        setNormalTexts();
        setTimeout(() => {
            c.clearRect(0, 0, canvas.width, canvas.height);
            c.fillStyle = 'white';
            c.font = '75px sans-serif';
            c.fillText("You won!!", canvas.width * 2 / 5, canvas.height / 2);
        }, 5000);
    }
};

const handleMouseUp = (e) => {
    e.preventDefault();
    draw();
};

// handle mousemove events
const handleMouseMove = (e) => {
    e.preventDefault();
    mouse.x = e.x;
    mouse.y = e.y;
    draw();

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

// music = new Audio("sounds/backMusic.mp3");
// music.loop = true;
// music.load();
// music.play();