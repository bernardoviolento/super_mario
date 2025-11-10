const mario = document.querySelector('.mario');
const pipesContainer = document.getElementById('pipes-container');
const scoreElement = document.getElementById('score');
const gameOverScreen = document.querySelector('.game-over');
const winMenu = document.getElementById('win-menu');
const finalScore = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

let isGameOver = false;
let score = 0;
let canosPassados = 0;
let pipes = [];
let gameLoop;
let pipeSpawner;

const PIPE_WIDTH = 80;
const PIPE_HEIGHT = 80;
const PIPE_SPEED = 5;
const PIPE_INTERVAL = 2000;

const GAME_WIDTH = 900;
const MARIO_SPEED = 7;
const JUMP_HEIGHT = 220; // pulo aumentado
const JUMP_DURATION = 600;

let marioPosX = 50;
let marioBottom = 0;
let isJumping = false;
let jumpStartTime = null;
let keysPressed = {};
let mushroomActive = false;
let marioGiant = false;

// Cria cano
function createPipe() {
    const pipe = document.createElement('img');
    pipe.src = 'imagens/pipe.png';
    pipe.classList.add('pipe');
    pipe.style.width = `${PIPE_WIDTH}px`;
    pipe.style.height = `${PIPE_HEIGHT}px`;
    pipe.style.left = `${GAME_WIDTH}px`;
    pipesContainer.appendChild(pipe);
    pipes.push({ element: pipe, positionX: GAME_WIDTH, type: 'pipe' });
}

// Cria cogumelo
function createMushroom() {
    const mushroom = document.createElement('img');
    mushroom.src = 'imagens/mushroom.png';
    mushroom.classList.add('mushroom');
    mushroom.style.left = `${GAME_WIDTH}px`;
    pipesContainer.appendChild(mushroom);
    pipes.push({ element: mushroom, positionX: GAME_WIDTH, type: 'mushroom' });
}

// Pulo manual
function startJump() {
    if (!isJumping && !isGameOver) {
        isJumping = true;
        jumpStartTime = performance.now();
    }
}

// Mario gigante ao pegar cogumelo
function activateGiant() {
    marioGiant = true;
    mario.style.width = '250px'; // Mario cresce bastante
    // Após 10 segundos, volta ao normal
    setTimeout(() => {
        marioGiant = false;
        mario.style.width = '100px';
    }, 10000);
}

// Atualiza Mario
function updateMario() {
    if (!isGameOver) {
        if (keysPressed['ArrowLeft']) {
            marioPosX = Math.max(0, marioPosX - MARIO_SPEED);
        }
        if (keysPressed['ArrowRight']) {
            marioPosX = Math.min(GAME_WIDTH - mario.offsetWidth, marioPosX + MARIO_SPEED);
        }
    }

    if (isJumping) {
        const elapsed = performance.now() - jumpStartTime;
        if (elapsed >= JUMP_DURATION) {
            isJumping = false;
            marioBottom = 0;
        } else {
            if (elapsed < JUMP_DURATION / 2) {
                marioBottom = (elapsed / (JUMP_DURATION / 2)) * JUMP_HEIGHT;
            } else {
                marioBottom = ((JUMP_DURATION - elapsed) / (JUMP_DURATION / 2)) * JUMP_HEIGHT;
            }
        }
    } else {
        marioBottom = 0;
    }

    mario.style.left = `${marioPosX}px`;
    mario.style.bottom = `${marioBottom}px`;
}

// Loop principal
function gameTick() {
    const marioRect = mario.getBoundingClientRect();

    updateMario();

    pipes.forEach((pipeObj, index) => {
        pipeObj.positionX -= PIPE_SPEED;
        pipeObj.element.style.left = `${pipeObj.positionX}px`;

        const pipeRect = pipeObj.element.getBoundingClientRect();

        if (pipeObj.type === 'pipe') {
            const pipeHitboxTop = pipeRect.top + 20; // hitbox menor
            const pipeHitboxBottom = pipeRect.bottom;

            if (!marioGiant) {
                if (
                    marioRect.right > pipeRect.left + 10 &&
                    marioRect.left < pipeRect.right - 10 &&
                    marioRect.bottom > pipeHitboxTop &&
                    marioRect.bottom < pipeHitboxBottom
                ) {
                    endGame();
                }
            } else {
                const isCollision =
                    marioRect.right > pipeRect.left &&
                    marioRect.left < pipeRect.right &&
                    marioRect.bottom > pipeHitboxTop &&
                    marioRect.bottom < pipeHitboxBottom;

                if (isCollision) {
                    pipesContainer.removeChild(pipeObj.element);
                    pipes.splice(index, 1);
                    score++;
                    canosPassados++;
                    scoreElement.textContent = score;
                    if (canosPassados >= 15) winGame();
                }
            }

            if (pipeRect.right < 0 && !marioGiant) {
                pipesContainer.removeChild(pipeObj.element);
                pipes.splice(index, 1);
                if (!isGameOver) {
                    score++;
                    canosPassados++;
                    scoreElement.textContent = score;
                    if (canosPassados >= 15) winGame();
                }
            }

            if (!mushroomActive && canosPassados === 7) {
                createMushroom();
                mushroomActive = true;
            }

        } else if (pipeObj.type === 'mushroom') {
            if (
                marioRect.right > pipeRect.left &&
                marioRect.left < pipeRect.right &&
                marioRect.bottom > pipeRect.top &&
                marioRect.bottom < pipeRect.bottom
            ) {
                pipesContainer.removeChild(pipeObj.element);
                pipes.splice(index, 1);
                activateGiant();
                mushroomActive = false;
            }

            if (pipeRect.right < 0) {
                pipesContainer.removeChild(pipeObj.element);
                pipes.splice(index, 1);
                mushroomActive = false;
            }
        }
    });
}

// Fim de jogo
function endGame() {
    if (isGameOver) return;

    isGameOver = true;
    mario.src = 'imagens/mario-gameover.png';
    mario.style.width = '75px';
    mario.style.marginLeft = '45px';
    gameOverScreen.style.display = 'block';

    clearInterval(gameLoop);
    clearInterval(pipeSpawner);
}

// Vitória
function winGame() {
    if (isGameOver) return;

    isGameOver = true;
    clearInterval(gameLoop);
    clearInterval(pipeSpawner);
    finalScore.textContent = score;
    winMenu.style.display = 'block';
}

// Reset
function resetGame() {
    isGameOver = false;
    score = 0;
    canosPassados = 0;
    scoreElement.textContent = score;
    mario.src = 'imagens/mario.png';
    mario.style.width = '100px';
    mario.style.marginLeft = '0px';

    pipes.forEach(p => pipesContainer.removeChild(p.element));
    pipes = [];

    marioPosX = 50;
    mario.style.left = `${marioPosX}px`;
    mario.style.bottom = '0px';

    gameOverScreen.style.display = 'none';
    winMenu.style.display = 'none';
    mushroomActive = false;
    marioGiant = false;

    createPipe();
    pipeSpawner = setInterval(createPipe, PIPE_INTERVAL);
    gameLoop = setInterval(gameTick, 20);
}

// Eventos de teclado
document.addEventListener('keydown', e => {
    keysPressed[e.key] = true;
    if ((e.key === 'ArrowUp' || e.key === ' ') && !isGameOver) startJump();
    if (e.key === 'Enter' && isGameOver) resetGame();
});

document.addEventListener('keyup', e => keysPressed[e.key] = false);

restartBtn.addEventListener('click', resetGame);

// Inicializa
createPipe();
pipeSpawner = setInterval(createPipe, PIPE_INTERVAL);
gameLoop = setInterval(gameTick, 20);
