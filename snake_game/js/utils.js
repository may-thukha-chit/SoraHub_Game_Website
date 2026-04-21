const audioCache = {};

function loadSounds() {
    for (const [key, url] of Object.entries(SOUND_URLS)) {
        audioCache[key] = new Audio(url);
    }
}

function playSound(name) {
    if (audioCache[name]) {
        audioCache[name].currentTime = 0;
        audioCache[name].play().catch(e => console.log("Audio play failed:", e));
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6'];

    for (let i = 0; i < 200; i++) {
        particles.push({
            x: canvas.width / 2,
            y: canvas.height / 2,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            size: Math.random() * 8 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 100
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let active = false;
        particles.forEach(p => {
            if (p.life > 0) {
                p.x += p.vx;
                p.y += p.vy;
                p.life--;
                ctx.fillStyle = p.color;
                ctx.fillRect(p.x, p.y, p.size, p.size);
                active = true;
            }
        });
        if (active) requestAnimationFrame(animate);
        else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    animate();
}