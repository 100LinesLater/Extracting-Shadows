var canvas = document.getElementById("main");
// var music;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

var staticTexts = [
    {text: "We live on a                island of ignorance in", x: 100, y: 120},
    {text: "the midst of black seas of infinity, and it", x: 140, y: 180},
    {text: "was not meant that we should voyage far.", x: 180, y: 240},
    {text: "- H.P. Lovecraft", x: 260, y: 300}
];

var targetTexts = [
    {text: "placid", x: 1000, y: 500 }
];

var storedTextIndices = [];

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

setNormalTexts();
setGoals();

var mouse = {
    x: undefined, 
    y: undefined
};

var startX;
var startY;
var textSelected = false;

const textHit = (x, y, textVar) => {
    let text = textVar;
    return (x >= text.x &&
        x <= text.x + c.measureText(text).width &&
        y >= text.y - 40 &&
        y <= text.y);
};

const handleMouseDown = (e) => {
    e.preventDefault();
    startX = mouse.x;
    startY = mouse.y;
    for (let i = 0; i < targetTexts.length; i++) {
        let text = targetTexts[i];
        if (textHit(startX, startY, text)) {
            textSelected = true;
            storedTextIndices.push(i);
            // Selection test
            console.log("Text Selected!");
        }
    }
};

const draw = () => {
    c.clearRect(0, 0, canvas.width, canvas.height);
    setNormalTexts();
    setGoals();
};

// done dragging
const handleMouseUp = (e) => {
    e.preventDefault();
    textSelected = false;
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