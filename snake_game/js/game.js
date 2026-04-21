let players = [];
let currentPlayerIndex = 0;
let isGameOver = false;
let gameSpeed = 500;
let turnCount = 0;
let userAvatar = "🔵";
let gameMode = "AI"; // Tracks if Player 2 is AI or Human

const rollBtn = document.getElementById("roll-btn");
const diceCube = document.getElementById("dice-cube");
const turnText = document.getElementById("turn-text");
const diceResult = document.getElementById("dice-result");
const speedSlider = document.getElementById("speed-slider");
const modal = document.getElementById("winner-modal");

function init() {
    createBoard();
    loadSounds();
    setupEventListeners();
    startGame();
}

function startGame() {
    const p2IsAI = (gameMode === "AI");
    
    players = [
        new Player("Player 1", "player1", false, userAvatar),
        new Player(p2IsAI ? "AI Bot" : "Player 2", "player2", p2IsAI, p2IsAI ? "🤖" : "🔴")
    ];
    
    document.querySelectorAll(".player-token").forEach(el => el.remove());
    const startTile = getTileElement(1); 
    if(startTile) players.forEach(p => startTile.appendChild(p.element));
    
    currentPlayerIndex = 0;
    isGameOver = false;
    turnCount = 0;
    modal.classList.add("hidden");
    turnText.innerText = `${players[0].name}'s Turn`;
    rollBtn.disabled = false;
    rollBtn.innerText = "🎲 Roll Dice";
}

function setupEventListeners() {
    rollBtn.onclick = handleRoll;
    document.getElementById("play-again-btn").onclick = startGame;
    speedSlider.oninput = (e) => { gameSpeed = parseInt(e.target.value); };

    // Mode Selection Logic
    const aiBtn = document.getElementById("vs-ai-btn");
    const humanBtn = document.getElementById("vs-human-btn");

    aiBtn.onclick = () => { gameMode = "AI"; aiBtn.classList.add("active"); humanBtn.classList.remove("active"); startGame(); };
    humanBtn.onclick = () => { gameMode = "HUMAN"; humanBtn.classList.add("active"); aiBtn.classList.remove("active"); startGame(); };

    document.querySelectorAll(".avatar-opt").forEach(opt => {
        opt.onclick = (e) => {
            document.querySelectorAll(".avatar-opt").forEach(o => o.classList.remove("selected"));
            e.target.classList.add("selected");
            userAvatar = e.target.dataset.char;
            startGame(); 
        };
    });
}

async function handleRoll() {
    if (isGameOver || rollBtn.disabled) return;
    const player = players[currentPlayerIndex];
    if (player.isAI) return;
    await performTurn(player);
}

async function performTurn(player) {
    if (player.id === 'player1') turnCount++;
    rollBtn.disabled = true;

    playSound("roll");
    diceCube.classList.add("rolling");
    await sleep(600); 
    diceCube.classList.remove("rolling");

    const roll = Math.floor(Math.random() * 6) + 1;
    updateDiceVisuals(roll);
    diceResult.innerText = `${player.name} rolled ${roll}`;

    await moveToken(player, roll);

    if (player.position === 100) {
        handleWin(player);
        return;
    }

    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    const nextPlayer = players[currentPlayerIndex];
    turnText.innerText = `${nextPlayer.name}'s Turn`;

    if (nextPlayer.isAI) {
        await sleep(1000);
        await performTurn(nextPlayer);
    } else {
        rollBtn.disabled = false;
    }
}

function updateDiceVisuals(num) {
    const transforms = {
        1: "rotateY(0deg)", 2: "rotateX(-90deg)", 3: "rotateY(-90deg)",
        4: "rotateY(90deg)", 5: "rotateX(90deg)", 6: "rotateY(180deg)"
    };
    diceCube.style.transform = transforms[num];
}

async function moveToken(player, steps) {
    for (let i = 0; i < steps; i++) {
        if (player.position < 100) {
            player.position++;
            getTileElement(player.position).appendChild(player.element);
            playSound("move");
            await sleep(gameSpeed / 2);
        }
    }
    await checkEntities(player);
}

async function checkEntities(player) {
    if (SNAKES[player.position]) {
        await sleep(400); playSound("snake");
        player.position = SNAKES[player.position];
        getTileElement(player.position).appendChild(player.element);
    } else if (LADDERS[player.position]) {
        await sleep(400); playSound("ladder");
        player.position = LADDERS[player.position];
        getTileElement(player.position).appendChild(player.element);
    }
}

function handleWin(player) {
    isGameOver = true;
    playSound("win");
    document.getElementById("winner-text").innerText = `${player.name} wins!`;
    modal.classList.remove("hidden");
}

document.addEventListener("DOMContentLoaded", init);