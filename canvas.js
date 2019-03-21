var canvas = document.getElementById("main");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

c.font = "40px sans-serif";
c.fillStyle = 'white';
c.fillText("We live on a              island of ignorance in", 100, 120);
c.fillText("the midst of black seas of infinity, and it", 140, 180);
c.fillText("was not meant that we should voyage far.", 180, 240);

var word = c.fillText("placid", 1000, 700);

c.fillStyle = `rgb(0,0,0)`;
var goal = c.fillRect(325, 65, 145, 80);