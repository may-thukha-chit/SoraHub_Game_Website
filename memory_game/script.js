const grid = document.getElementById('grid');
const statusText = document.getElementById('status');
const modeBtn = document.getElementById('modeBtn');
const resetBtn = document.getElementById('resetBtn');

const emojis = ['🐶','🐶','🐱','🐱','🐭','🐭','🐹','🐹','🐰','🐰','🦊','🦊'];

let cards = [];
let flipped = [];
let currentPlayer = 1;
let isAiMode = true;
let lockBoard = false;

// 🧠 AI MEMORY (FORGETFUL)
let aiMemory = {};
let aiOrder = [];
const AI_MEMORY_LIMIT = 6;

// Scores
let history = JSON.parse(localStorage.getItem('memoryGameScores')) || { p1: 0, p2: 0 };
updateScoreUI();

function initGame() {
    grid.innerHTML = '';
    cards = [...emojis].sort(() => Math.random() - 0.5);
    flipped = [];
    currentPlayer = 1;
    lockBoard = false;
    aiMemory = {};
    aiOrder = [];
    updateStatus();

    cards.forEach((_, i) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.onclick = () => flipCard(i);
        grid.appendChild(card);
    });
}

function remember(index) {
    if (!(index in aiMemory)) {
        aiMemory[index] = cards[index];
        aiOrder.push(index);
        if (aiOrder.length > AI_MEMORY_LIMIT) {
            delete aiMemory[aiOrder.shift()];
        }
    }
}

function flipCard(index) {
    const cardEls = document.querySelectorAll('.card');
    const card = cardEls[index];

    if (lockBoard || flipped.includes(index) || card.classList.contains('matched')) return;

    card.classList.add('flipped');
    card.innerHTML = `<span>${cards[index]}</span>`;
    flipped.push(index);
    remember(index);

    if (flipped.length === 2) checkMatch();
}

function checkMatch() {
    lockBoard = true;
    const [a, b] = flipped;
    const cardEls = document.querySelectorAll('.card');

    if (cards[a] === cards[b]) {
        setTimeout(() => {
            cardEls[a].classList.add('matched');
            cardEls[b].classList.add('matched');
            flipped = [];
            lockBoard = false;

            if (!checkGameOver()) {
                if (isAiMode && currentPlayer === 2) aiMove();
            }
        }, 150);
    } else {
        setTimeout(() => {
            cardEls[a].classList.remove('flipped');
            cardEls[b].classList.remove('flipped');
            cardEls[a].innerHTML = '';
            cardEls[b].innerHTML = '';
            flipped = [];
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            updateStatus();
            lockBoard = false;

            if (isAiMode && currentPlayer === 2) aiMove();
        }, 250);
    }
}

function showAiMessage(text, duration = 600) {
    statusText.innerText = text;
    setTimeout(updateStatus, duration);
}
function aiMove() {
    const cardEls = document.querySelectorAll('.card');
    let first = -1, second = -1;
    const keys = Object.keys(aiMemory);

    // Try remembered pair
    for (let i = 0; i < keys.length; i++) {
        for (let j = i + 1; j < keys.length; j++) {
            if (
                aiMemory[keys[i]] === aiMemory[keys[j]] &&
                !cardEls[keys[i]].classList.contains('matched')
            ) {
                first = +keys[i];
                second = +keys[j];
                break;
            }
        }
        if (first !== -1) break;
    }

    // Random fallback
    const available = [...Array(cards.length).keys()]
        .filter(i => !cardEls[i].classList.contains('matched'));

    if (first === -1) {
        first = available[Math.floor(Math.random() * available.length)];
        second = available.filter(i => i !== first)
            [Math.floor(Math.random() * (available.length - 1))];
    }

    // 🧠 NEW: show message
    showAiMessage("🤖 AI flipped two cards!");

    flipCard(first);
    flipCard(second);
}

function checkGameOver() {
    if (document.querySelectorAll('.matched').length === cards.length) {
        history[currentPlayer === 1 ? 'p1' : 'p2']++;
        localStorage.setItem('memoryGameScores', JSON.stringify(history));
        updateScoreUI();
        statusText.innerText = "Game Complete!";
        return true;
    }
    return false;
}

function updateScoreUI() {
    document.getElementById('p1-total').innerText = history.p1;
    document.getElementById('p2-total').innerText = history.p2;
}

function updateStatus() {
    statusText.innerText = `Player ${currentPlayer}'s Turn`;
}

modeBtn.onclick = () => {
    isAiMode = !isAiMode;
    modeBtn.innerText = isAiMode ? "Mode: vs AI" : "Mode: 2 Player";
    initGame();
};

resetBtn.onclick = initGame;
initGame();