const BOARD_SIZE = 100;
const ROWS = 10;
const COLS = 10;

const SNAKES = {
    99: 54, 
    70: 55, 
    52: 42, 
    25: 2, 
    95: 75
};

const LADDERS = {
    6: 25, 
    11: 40, 
    60: 85, 
    46: 90, 
    17: 69
};

const SOUND_URLS = {
    roll: 'https://www.soundjay.com/board-games/sounds/dice-roll-1.mp3',
    move: 'https://www.soundjay.com/button/sounds/button-16.mp3',
    win: 'https://www.soundjay.com/human/sounds/applause-01.mp3',
    snake: 'https://www.soundjay.com/nature/sounds/snake-hiss-1.mp3',
    ladder: 'https://www.soundjay.com/communication/sounds/chime-glass-1.mp3'
};