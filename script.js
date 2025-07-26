const loadingScreen = document.getElementById('loadingScreen');
const mainMenu = document.getElementById('mainMenu');
const gameContainer = document.getElementById('gameContainer');
const startGameBtn = document.getElementById('startGameBtn');
const howToPlayBtn = document.getElementById('howToPlayBtn');
const instructions = document.getElementById('instructions');
const restartBtn = document.getElementById('restartBtn');

// Fail-safe loading screen
window.addEventListener('load', () => {
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        mainMenu.style.display = 'block';
    }, 2500);
});

howToPlayBtn.addEventListener('click', () => {
    instructions.style.display = instructions.style.display === 'none' ? 'block' : 'none';
});

startGameBtn.addEventListener('click', () => {
    mainMenu.style.display = 'none';
    gameContainer.style.display = 'block';
    restartBtn.click();
});

restartBtn.addEventListener('click', () => {
    document.getElementById('score').innerText = "Score: 0 | Best: 0";
    document.getElementById('timer').innerText = "Time: 30s";
});