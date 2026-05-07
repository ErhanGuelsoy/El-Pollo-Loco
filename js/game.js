class GameAudio {

    AUDIO_FILES = [
        "audio/dragon-studio-car-crash-sound-376882.mp3",
        "audio/freesound_community-cartoon-jump-6462.mp3",
        "audio/liecio-collect-points-190037.mp3",
        "audio/spinopel-run-on-asphalt-road-393093.mp3",
        "audio/freesound_community-chicken-single-alarm-call-6056.mp3",
        "audio/digitalstore07-chicken-430403.mp3",
        "audio/freesound_community-collectcoin-6075.mp3",
        "audio/kaazoom-run-and-catch-x27em-full-version-retro-platform-game-music-442980.mp3"
    ];

    constructor() {
        this.sounds = [];
        this.loadSounds();
    }

    loadSounds() {
        this.AUDIO_FILES.forEach(path => {
            const audio = new Audio(path);
            audio.preload = "auto";
            this.sounds.push(audio);
        });
    }

    play(index) {
        if (!this.sounds[index]) return;
        this.sounds[index].currentTime = 0;
        this.sounds[index].play().catch(() => {});
    }

    muteAll(muted) {
        this.sounds.forEach(s => s.muted = muted);
    }
}

// =========================
// GLOBAL STATE
// =========================
let keyboard = new Keyboard();
let canvas, world, gameAudio;

let isMuted = false;
let canJumpSound = true;
let isRunning = false;
let canPlayCoinSound = true;

// =========================
// INIT
// =========================
function init() {
    canvas = document.getElementById('canvas');

    document.getElementById('start_game').addEventListener('click', startGame);
    document.getElementById('startBTN').addEventListener('click', startGame);

    const audioBTN = document.getElementById("audioBTN");

    audioBTN.addEventListener("click", () => {
        isMuted = !isMuted;
        if (gameAudio) gameAudio.muteAll(isMuted);
        audioBTN.innerText = isMuted ? "🔇" : "🔊";
    });
}

// =========================
// START GAME
// =========================
function startGame() {

    document.getElementById('start_game').style.display = 'none';
    document.getElementById('playOverlay').style.display = 'none';
    document.getElementById('winScreen').classList.add('hidden');

    initLevel();

    world = new World(canvas, keyboard);

    gameAudio = new GameAudio();
    window.gameAudio = gameAudio;

    // 🎵 BACKGROUND MUSIC
    const bgMusic = gameAudio.sounds[7];
    bgMusic.loop = true;
    bgMusic.volume = 0.4;
    bgMusic.currentTime = 0;
    bgMusic.play().catch(() => {});

    bindControlButtons();
}

// =========================
// 🔥 FIXED RESTART (NO RELOAD)
// =========================

function restartGame() {

    // Stop old game
    if (world) {
        world.gameEnded = true;
        world = null;
    }

    // Stop audio
    if (gameAudio) {
        gameAudio.sounds.forEach(s => {
            s.pause();
            s.currentTime = 0;
        });
    }

    // Reset keyboard
    keyboard = new Keyboard();

    // Clear canvas
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Hide win screen
    document.getElementById('winScreen').classList.add('hidden');

    // Restart level + world
    initLevel();
    world = new World(canvas, keyboard);

    gameAudio = new GameAudio();
    window.gameAudio = gameAudio;

    const bgMusic = gameAudio.sounds[7];
    bgMusic.loop = true;
    bgMusic.volume = 0.4;
    bgMusic.play().catch(() => {});
}

// =========================
// SOUND
// =========================
function triggerJump() {
    if (!gameAudio || !canJumpSound) return;
    gameAudio.play(1);

    canJumpSound = false;
    setTimeout(() => canJumpSound = true, 300);
}

function playEndbossSound() {
    if (gameAudio) gameAudio.play(4);
}

function playCoinSound() {
    if (!gameAudio || !canPlayCoinSound) return;
    gameAudio.play(2);

    canPlayCoinSound = false;
    setTimeout(() => canPlayCoinSound = true, 200);
}

// =========================
// CONTROLS
// =========================
window.addEventListener('keydown', e => {

    if (e.keyCode == 39) keyboard.RIGHT = true;
    if (e.keyCode == 37) keyboard.LEFT = true;
    if (e.keyCode == 38) keyboard.UP = true;
    if (e.keyCode == 40) keyboard.DOWN = true;

    if (e.keyCode == 32) {
        keyboard.SPACE = true;
        keyboard.UP = true;
        triggerJump();
    }

    if (e.keyCode == 68) keyboard.D = true;
});

window.addEventListener('keyup', e => {

    if (e.keyCode == 39) keyboard.RIGHT = false;
    if (e.keyCode == 37) keyboard.LEFT = false;
    if (e.keyCode == 38) keyboard.UP = false;
    if (e.keyCode == 40) keyboard.DOWN = false;

    if (e.keyCode == 32) {
        keyboard.SPACE = false;
        keyboard.UP = false;
    }

    if (e.keyCode == 68) keyboard.D = false;
});

// =========================
// TOUCH BUTTONS
// =========================
function bindControlButtons() {

    document.getElementById('btnLeft').addEventListener('pointerdown', () => keyboard.LEFT = true);
    document.getElementById('btnLeft').addEventListener('pointerup', () => keyboard.LEFT = false);

    document.getElementById('btnRight').addEventListener('pointerdown', () => keyboard.RIGHT = true);
    document.getElementById('btnRight').addEventListener('pointerup', () => keyboard.RIGHT = false);

    document.getElementById('jumpBTN').addEventListener('pointerdown', () => {
        keyboard.UP = true;
        triggerJump();
    });

    document.getElementById('jumpBTN').addEventListener('pointerup', () => keyboard.UP = false);

    document.getElementById('throw').addEventListener('pointerdown', () => keyboard.D = true);
    document.getElementById('throw').addEventListener('pointerup', () => keyboard.D = false);
}

// =========================
// MENU ACTIONS
// =========================
function backToMenu() {
    location.href = "index.html";
}