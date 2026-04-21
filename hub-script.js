function loadAllStats() {
    // 1. TTT Logic (Matching your JSON object format)
    const tttWins = JSON.parse(localStorage.getItem('ttt-wins')) || { X: 0, O: 0 };
    const tttCount = tttWins.X;

    // 2. Simple Ints for other games
    const slCount = parseInt(localStorage.getItem('sl-wins')) || 0;
    const memCount = parseInt(localStorage.getItem('mem-wins')) || 0;
    const c4Count = parseInt(localStorage.getItem('c4-wins')) || 0;

    // UI Updates
    document.getElementById('ttt-wins').innerText = tttCount;
    document.getElementById('sl-wins').innerText = slCount;
    document.getElementById('mem-wins').innerText = memCount;
    document.getElementById('c4-wins').innerText = c4Count;

    // Global Total
    document.getElementById('total-wins').innerText = tttCount + slCount + memCount + c4Count;
}

document.getElementById('reset-global').addEventListener('click', () => {
    if(confirm("Erase all victory data from Sora Hub?")) {
        localStorage.clear();
        location.reload();
    }
});

window.onload = loadAllStats;