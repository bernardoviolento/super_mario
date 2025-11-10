const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const scoreElement = document.getElementById('score');
const gameOverText = document.querySelector('.game-over');

let isGameOver = false;
let score = 0;

function jump() {
    if (!mario.classList.contains('jump') && !isGameOver) {
        mario.classList.add('jump');
        setTimeout(() => mario.classList.remove('jump'), 600);
    }
}

document.addEventListener('keydown', jump);

const gameLoop = setInterval(() => {
    const pipePosition = pipe.getBoundingClientRect().left;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

    if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
        pipe.style.animation = 'none';
        pipe.style.left = `${pipePosition}px`;

        mario.style.animation = 'none';
        mario.style.bottom = `${marioPosition}px`;

        mario.src = 'imagens/mario-gameover.png';
        mario.style.width = '75px';
        mario.style.marginLeft = '45px';

        gameOverText.style.display = 'block';
        isGameOver = true;
        clearInterval(gameLoop);
    } else if (!isGameOver) {
        score++;
        scoreElement.textContent = score;
    }
}, 20);
