const boardEl = document.getElementById("board");

function createBoard() {
    boardEl.innerHTML = "";
    let reverse = false;

    for (let row = ROWS - 1; row >= 0; row--) {
        let rowTiles = [];
        for (let col = 1; col <= COLS; col++) {
            rowTiles.push({ row, col, num: row * 10 + col });
        }
        
        if (reverse) rowTiles.reverse();
        reverse = !reverse;

        rowTiles.forEach(tileData => {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            tile.classList.add((tileData.row + tileData.col) % 2 === 0 ? "tile-dark" : "tile-light");
            tile.dataset.num = tileData.num;

            // Number
            const numSpan = document.createElement("span");
            numSpan.classList.add("tile-number");
            numSpan.innerText = tileData.num;
            tile.appendChild(numSpan);

            // Markers
            if (SNAKES[tileData.num]) addMarker(tile, "🐍");
            if (LADDERS[tileData.num]) addMarker(tile, "🪜");

            boardEl.appendChild(tile);
        });
    }
}

function addMarker(parent, icon) {
    const m = document.createElement("div");
    m.classList.add("marker");
    m.innerText = icon;
    parent.appendChild(m);
}

function getTileElement(num) {
    return document.querySelector(`.tile[data-num='${num}']`);
}