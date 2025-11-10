const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const scoreElement = document.getElementById('score');
const gameOverText = document.querySelector('.game-over');

// 🎵 Sons
const bgMusic = new Audio('https://www.myinstants.com/media/sounds/super-mario-bros-theme.mp3');
const jumpSound = new Audio('https://www.myinstants.com/media/sounds/mario_jump.mp3');
const gameOverSound = new Audio('https://www.myinstants.com/media/sounds/mario-dies.mp3');

let score = 0;
let isGameOver = false;
let loopInterval;
let scoreLoop;

// Função para tocar música de fundo (loop)
function playMusic() {
    bgMusic.loop = true;
    bgMusic.volume = 0.2;
    bgMusic.play().catch(() => {
        // alguns navegadores exigem interação antes de tocar som
    });
}

// Função de pulo
function jump() {
    if (!mario.classList.contains('jump') && !isGameOver) {
        mario.classList.add('jump');
        jumpSound.currentTime = 0;
        jumpSound.play();
        setTimeout(() => {
            mario.classList.remove('jump');
        }, 500);
    }
}

// Função principal do jogo
function startGame() {
    playMusic();

    loopInterval = setInterval(() => {
        const pipePosition = pipe.offsetLeft;
        const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

        if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
            endGame(pipePosition, marioPosition);
        }
    }, 10);

    scoreLoop = setInterval(() => {
        if (!isGameOver) {
            score++;
            scoreElement.textContent = score;
        }
    }, 200);
}

function endGame(pipePosition, marioPosition) {
    isGameOver = true;

    pipe.style.animation = 'none';
    pipe.style.left = `${pipePosition}px`;

    mario.style.animation = 'none';
    mario.style.bottom = `${marioPosition}px`;

    mario.src = 'https://i.imgur.com/4VgT8Ig.png';
    mario.style.width = '75px';
    mario.style.marginLeft = '45px';

    bgMusic.pause();
    gameOverSound.play();

    gameOverText.style.display = 'block';

    clearInterval(loopInterval);
    clearInterval(scoreLoop);

    setTimeout(() => {
        restartGame();
    }, 3000);
}

function restartGame() {
    score = 0;
    scoreElement.textContent = 0;
    isGameOver = false;
    gameOverText.style.display = 'none';

    mario.src = 'https://i.imgur.com/NMndW8A.png';
    mario.style.width = '120px';
    mario.style.marginLeft = '0px';

    pipe.style.animation = 'pipe-animation 2s infinite linear';

    playMusic();
    startGame();
}

// Início
document.addEventListener('keydown', jump);
window.onload = startGame;
