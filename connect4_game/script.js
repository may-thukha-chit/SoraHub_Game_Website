const ROWS = 6, COLS = 7;
let board = [], currentPlayer = 'red', gameActive = true, isAiMode = true;
let scores = JSON.parse(localStorage.getItem('c4-data')) || { p1: 0, p2: 0 };

const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');

function initGame() {
    board = Array(ROWS).fill().map(() => Array(COLS).fill(null));
    boardEl.innerHTML = '';
    gameActive = true;
    currentPlayer = 'red';
    statusEl.innerText = "Red's Turn";
    
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const slot = document.createElement('div');
            slot.classList.add('slot');
            slot.dataset.col = c;
            slot.id = `slot-${r}-${c}`;
            slot.onclick = () => playerMove(c);
            boardEl.appendChild(slot);
        }
    }
    updateScoreUI();
}

function playerMove(col) {
    if (!gameActive || (isAiMode && currentPlayer === 'yellow')) return;
    makeMove(col);
}

function makeMove(col) {
    for (let r = ROWS - 1; r >= 0; r--) {
        if (!board[r][col]) {
            board[r][col] = currentPlayer;
            const slot = document.getElementById(`slot-${r}-${c = col}`);
            const piece = document.createElement('div');
            piece.classList.add('piece', currentPlayer);
            slot.appendChild(piece);

            if (checkWin(r, col)) {
                endGame(currentPlayer);
            } else if (board.flat().every(s => s)) {
                endGame('draw');
            } else {
                currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
                statusEl.innerText = `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}'s Turn`;
                if (isAiMode && currentPlayer === 'yellow') setTimeout(aiMove, 600);
            }
            return;
        }
    }
}

function aiMove() {
    if (!gameActive) return;
    let col = getRandomCol();
    makeMove(col);
}

function getRandomCol() {
    let validCols = [];
    for (let c = 0; c < COLS; c++) if (!board[0][c]) validCols.push(c);
    return validCols[Math.floor(Math.random() * validCols.length)];
}

function checkWin(r, c) {
    const p = board[r][c];
    const modes = [[0,1], [1,0], [1,1], [1,-1]];
    return modes.some(([dr, dc]) => {
        let count = 1;
        [[dr, dc], [-dr, -dc]].forEach(([tr, tc]) => {
            let nr = r + tr, nc = c + tc;
            while(nr>=0 && nr<ROWS && nc>=0 && nc<COLS && board[nr][nc] === p) {
                count++; nr+=tr; nc+=tc;
            }
        });
        return count >= 4;
    });
}

function endGame(result) {
    gameActive = false;
    if (result === 'draw') {
        statusEl.innerText = "It's a Draw!";
    } else {
        statusEl.innerText = `${result.toUpperCase()} WINS!`;
        result === 'red' ? scores.p1++ : scores.p2++;
        localStorage.setItem('c4-data', JSON.stringify(scores));
        
        localStorage.setItem('c4-wins', scores.p1);
        updateScoreUI();
    }
}

function updateScoreUI() {
    const s1El = document.getElementById('s1');
    const s2El = document.getElementById('s2');
    if (s1El && s2El) {
        s1El.innerText = scores.p1;
        s2El.innerText = scores.p2;
    }
}


const themeBtn = document.getElementById('theme-toggle');
if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        localStorage.setItem('c4-theme', isLight ? 'light' : 'dark');
    });
}

if (localStorage.getItem('c4-theme') === 'light') {
    document.body.classList.add('light-theme');
}


document.getElementById('modeBtn').onclick = (e) => {
    isAiMode = !isAiMode;
    e.target.innerText = isAiMode ? "Mode: vs AI" : "Mode: 2 Player";
    initGame();
};
document.getElementById('resetBtn').onclick = initGame;


initGame();