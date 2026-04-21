const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const historyList = document.getElementById('history-list');
const modeSelect = document.getElementById('game-mode');
const themeToggle = document.getElementById('theme-toggle');

// State Setup
let wins = JSON.parse(localStorage.getItem('ttt-wins')) || { X: 0, O: 0 };
let gameState = JSON.parse(localStorage.getItem('ttt-board')) || Array(9).fill("");
let currentPlayer = localStorage.getItem('ttt-player') || "X";
let history = JSON.parse(localStorage.getItem('ttt-history')) || [];
let gameMode = localStorage.getItem('ttt-mode') || "pvp";
let currentTheme = localStorage.getItem('ttt-theme') || "dark-theme";
let gameActive = true;

const winConditions = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

function init() {
    document.body.className = currentTheme;
    modeSelect.value = gameMode;
    document.getElementById('x-wins').innerText = wins.X;
    document.getElementById('o-wins').innerText = wins.O;
    
    gameState.forEach((mark, i) => {
        if(mark) {
            cells[i].innerText = mark;
            cells[i].classList.add(mark.toLowerCase());
        }
    });

    renderHistory();
    updateStatus();
    
    // If it was AI's turn when refreshed
    if (gameMode === 'ai' && currentPlayer === 'O' && !checkWinner(gameState)) {
        setTimeout(aiMove, 500);
    }
}

function handleCellClick(e) {
    const idx = e.target.dataset.index;
    if (gameState[idx] !== "" || !gameActive) return;

    executeMove(idx, currentPlayer);

    if (gameActive && gameMode === 'ai' && currentPlayer === 'O') {
        gameActive = false; // Pause user input
        setTimeout(aiMove, 500);
    }
}

function executeMove(idx, player) {
    gameState[idx] = player;
    cells[idx].innerText = player;
    cells[idx].classList.add(player.toLowerCase());

    if (checkWinner(gameState)) {
        endGame(player);
    } else if (!gameState.includes("")) {
        endGame("Draw");
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        updateStatus();
    }
    saveData();
}

function updateStatus() {
    statusText.innerText = `Player ${currentPlayer}'s Turn`;
}

function checkWinner(board) {
    return winConditions.some(c => board[c[0]] !== "" && board[c[0]] === board[c[1]] && board[c[0]] === board[c[2]]);
}

function endGame(result) {
    gameActive = false;
    statusText.innerText = result === "Draw" ? "It's a Draw!" : `Player ${result} Wins!`;
    
    if (result !== "Draw") {
        wins[result]++;
        document.getElementById('x-wins').innerText = wins.X;
        document.getElementById('o-wins').innerText = wins.O;
    }

    history.unshift({ winner: result, time: new Date().toLocaleTimeString() });
    if(history.length > 8) history.pop();
    
    renderHistory();
    saveData();
}

// --- AI BRAIN (MINIMAX) ---
function aiMove() {
    gameActive = true;
    let bestMove = minimax(gameState, "O").index;
    executeMove(bestMove, "O");
}

function minimax(newBoard, player) {
    const availSpots = newBoard.map((v, i) => v === "" ? i : null).filter(v => v !== null);

    if (checkWinSim(newBoard, "X")) return { score: -10 };
    if (checkWinSim(newBoard, "O")) return { score: 10 };
    if (availSpots.length === 0) return { score: 0 };

    const moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        let move = { index: availSpots[i] };
        newBoard[availSpots[i]] = player;

        move.score = player === "O" ? minimax(newBoard, "X").score : minimax(newBoard, "O").score;

        newBoard[availSpots[i]] = "";
        moves.push(move);
    }

    let bestMoveIndex = 0;
    if (player === "O") {
        let bestScore = -Infinity;
        moves.forEach((m, i) => { if(m.score > bestScore) { bestScore = m.score; bestMoveIndex = i; } });
    } else {
        let bestScore = Infinity;
        moves.forEach((m, i) => { if(m.score < bestScore) { bestScore = m.score; bestMoveIndex = i; } });
    }
    return moves[bestMoveIndex];
}

function checkWinSim(board, player) {
    return winConditions.some(c => board[c[0]] === player && board[c[1]] === player && board[c[2]] === player);
}

// --- UTILS ---
function saveData() {
    localStorage.setItem('ttt-board', JSON.stringify(gameState));
    localStorage.setItem('ttt-player', currentPlayer);
    localStorage.setItem('ttt-wins', JSON.stringify(wins));
    localStorage.setItem('ttt-history', JSON.stringify(history));
    localStorage.setItem('ttt-theme', currentTheme);
    localStorage.setItem('ttt-mode', gameMode);
}

function renderHistory() {
    historyList.innerHTML = history.map(h => `
        <li class="history-item">
            <span>${h.winner === 'Draw' ? '🤝 Draw' : '🏆 ' + h.winner}</span>
            <small>${h.time}</small>
        </li>
    `).join('');
}

themeToggle.addEventListener('click', () => {
    currentTheme = document.body.classList.contains('dark-theme') ? 'light-theme' : 'dark-theme';
    document.body.className = currentTheme;
    saveData();
});

modeSelect.addEventListener('change', (e) => {
    gameMode = e.target.value;
    resetGame();
});

document.getElementById('board').addEventListener('click', handleCellClick);
document.getElementById('reset-btn').addEventListener('click', resetGame);
document.getElementById('clear-storage').addEventListener('click', () => { localStorage.clear(); location.reload(); });

function resetGame() {
    gameState = Array(9).fill("");
    currentPlayer = "X";
    gameActive = true;
    cells.forEach(c => { c.innerText = ""; c.classList.remove('x', 'o'); });
    updateStatus();
    saveData();
}

init();