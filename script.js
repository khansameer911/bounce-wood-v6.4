const loadingScreen = document.getElementById('loadingScreen');
const mainMenu = document.getElementById('mainMenu');
const gameContainer = document.getElementById('gameContainer');
const startGameBtn = document.getElementById('startGameBtn');
const howToPlayBtn = document.getElementById('howToPlayBtn');
const instructions = document.getElementById('instructions');
const restartBtn = document.getElementById('restartBtn');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const gameOverText = document.getElementById('gameOver');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Sounds
const coinSound = document.getElementById('coinSound');
const gameOverSound = document.getElementById('gameOverSound');
const bgMusic = document.getElementById('bgMusic');

// Load Best Score from localStorage
let bestScore = localStorage.getItem("bouncewood_best") || 0;

// Game vars
let ball, coins, obstacles, score, timer, gameInterval, timerInterval;
canvas.width = 400;
canvas.height = 500;

// Load Images
const bgImg = new Image();
bgImg.src = "background.png";
const ballImg = new Image();
ballImg.src = "ball.png";
const coinImg = new Image();
coinImg.src = "coin.png";
const obsImg = new Image();
obsImg.src = "obstacle.png";

// === LOADING SCREEN ===
window.addEventListener('load', () => {
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        mainMenu.style.display = 'block';
    }, 2500);
});

// === MENU BUTTONS ===
howToPlayBtn.addEventListener('click', () => {
    instructions.style.display = instructions.style.display === 'none' ? 'block' : 'none';
});

startGameBtn.addEventListener('click', () => {
    mainMenu.style.display = 'none';
    gameContainer.style.display = 'block';
    startGame();
});

restartBtn.addEventListener('click', startGame);

// === START GAME ===
function startGame() {
    score = 0;
    timer = 30;
    gameOverText.style.display = 'none';
    ball = { x:200, y:400, r:20, speed:4, dx:0, dy:0 };
    coins = [];
    obstacles = [];
    bgMusic.play();

    for (let i=0; i<5; i++) spawnCoin();
    for (let i=0; i<3; i++) spawnObstacle();

    clearInterval(gameInterval);
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        timer--;
        if(timer <= 0) endGame();
        timerDisplay.textContent = `Time: ${timer}s`;
    }, 1000);

    gameInterval = setInterval(updateGame, 1000/60);
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    bgMusic.pause();
    gameOverSound.play();
    gameOverText.style.display = 'block';

    if(score > bestScore) {
        bestScore = score;
        localStorage.setItem("bouncewood_best", bestScore);
    }
}

// === GAME LOOP ===
function updateGame() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Boundaries
    if(ball.x - ball.r < 0) ball.x = ball.r;
    if(ball.x + ball.r > canvas.width) ball.x = canvas.width - ball.r;
    if(ball.y - ball.r < 0) ball.y = ball.r;
    if(ball.y + ball.r > canvas.height) ball.y = canvas.height - ball.r;

    // Move obstacles
    obstacles.forEach(o => {
        o.x += o.dx;
        o.y += o.dy;
        if(o.x <= 0 || o.x + o.w >= canvas.width) o.dx *= -1;
        if(o.y <= 0 || o.y + o.h >= canvas.height) o.dy *= -1;
    });

    // Check coins
    coins.forEach((c, i) => {
        if(Math.hypot(ball.x - c.x, ball.y - c.y) < ball.r + c.r){
            coins.splice(i,1);
            score += 10;
            timer += 4;
            coinSound.play();
            spawnCoin();
        }
    });

    // Check obstacles
    obstacles.forEach(o => {
        if(ball.x + ball.r > o.x && ball.x - ball.r < o.x+o.w &&
           ball.y + ball.r > o.y && ball.y - ball.r < o.y+o.h){
            endGame();
        }
    });

    scoreDisplay.textContent = `Score: ${score} | Best: ${bestScore}`;
    drawGame();
}

// === DRAW GAME ===
function drawGame(){
    // Background
    if(bgImg.complete) {
        ctx.drawImage(bgImg,0,0,canvas.width,canvas.height);
    } else {
        ctx.fillStyle = '#222';
        ctx.fillRect(0,0,canvas.width,canvas.height);
    }

    // Ball
    if(ballImg.complete){
        ctx.drawImage(ballImg, ball.x - ball.r, ball.y - ball.r, ball.r*2, ball.r*2);
    } else {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2);
        ctx.fill();
    }

    // Coins
    coins.forEach(c=>{
        if(coinImg.complete){
            ctx.drawImage(coinImg, c.x - c.r, c.y - c.r, c.r*2, c.r*2);
        } else {
            ctx.fillStyle = 'yellow';
            ctx.beginPath();
            ctx.arc(c.x, c.y, c.r, 0, Math.PI*2);
            ctx.fill();
        }
    });

    // Obstacles
    obstacles.forEach(o=>{
        if(obsImg.complete){
            ctx.drawImage(obsImg, o.x, o.y, o.w, o.h);
        } else {
            ctx.fillStyle = 'green';
            ctx.fillRect(o.x,o.y,o.w,o.h);
        }
    });
}

function spawnCoin(){
    coins.push({ x:Math.random()*360+20, y:Math.random()*460+20, r:15 });
}

function spawnObstacle(){
    let dir = Math.random()<0.5 ? {dx:2, dy:0} : {dx:0, dy:2}; 
    obstacles.push({ x:Math.random()*300, y:Math.random()*400, w:80, h:20, dx:dir.dx, dy:dir.dy });
}

// === CONTROLS ===
document.addEventListener('keydown', e=>{
    if(e.key==='ArrowUp') ball.dy=-ball.speed;
    if(e.key==='ArrowDown') ball.dy=ball.speed;
    if(e.key==='ArrowLeft') ball.dx=-ball.speed;
    if(e.key==='ArrowRight') ball.dx=ball.speed;
});
document.addEventListener('keyup', e=>{
    if(['ArrowUp','ArrowDown'].includes(e.key)) ball.dy=0;
    if(['ArrowLeft','ArrowRight'].includes(e.key)) ball.dx=0;
});

document.getElementById('upBtn').ontouchstart=()=>ball.dy=-ball.speed;
document.getElementById('downBtn').ontouchstart=()=>ball.dy=ball.speed;
document.getElementById('leftBtn').ontouchstart=()=>ball.dx=-ball.speed;
document.getElementById('rightBtn').ontouchstart=()=>ball.dx=ball.speed;
document.querySelectorAll('.control-btn').forEach(btn=>{
    btn.ontouchend=()=>{ball.dx=0; ball.dy=0;}
});