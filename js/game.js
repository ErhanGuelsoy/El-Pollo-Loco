// =========================
// game.js
// =========================

// =========================
// AUDIO
// =========================
class GameAudio {
    AUDIO_FILES = [
        "audio/dragon-studio-car-crash-sound-376882.mp3",
        "audio/freesound_community-cartoon-jump-6462.mp3",
        "audio/liecio-collect-points-190037.mp3",
        "audio/spinopel-run-on-asphalt-road-393093.mp3",
        "audio/freesound_community-chicken-single-alarm-call-6056.mp3",
        "audio/digitalstore07-chicken-430403.mp3"
    ];

    constructor() {
        this.sounds = [];
        this.loadSounds();
    }

    loadSounds() {
        this.AUDIO_FILES.forEach((path, i) => {
            let audio = new Audio(path);
            audio.preload = "auto";

            if (i === 3) { // Lauf-Sound
                audio.loop = true;
                audio.volume = 0.4;
            }

            this.sounds.push(audio);
        });
    }

    play(index) {
        if (this.sounds[index]) {
            this.sounds[index].currentTime = 0;
            this.sounds[index].play().catch(() => {});
        }
    }

    muteAll(muted) {
        this.sounds.forEach(sound => sound.muted = muted);
    }

    unlock() {
        this.sounds.forEach(sound => {
            sound.play().then(() => {
                sound.pause();
                sound.currentTime = 0;
            }).catch(() => {});
        });
    }
}

// =========================
// GLOBALS
// =========================
let keyboard = new Keyboard();
let canvas;
let world;
let gameAudio;
let isMuted = false;
let canJumpSound = true;
let isRunning = false;

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

    initLevel(); // Level initialisieren
    world = new World(canvas, keyboard);

    gameAudio = new GameAudio();
    gameAudio.unlock();

    bindControlButtons();
}

// =========================
// JUMP
// =========================
function triggerJump() {
    if (!gameAudio || !canJumpSound) return;
    gameAudio.play(1); // Jump Sound
    canJumpSound = false;
    setTimeout(() => { canJumpSound = true; }, 300);
}

// =========================
// RUN SOUND
// =========================
function handleRunSound() {
    if (!gameAudio) return;
    const moving = keyboard.LEFT || keyboard.RIGHT;

    if (moving && !isRunning) { 
        gameAudio.sounds[3].play().catch(()=>{}); 
        isRunning = true; 
    }
    if (!moving && isRunning) { 
        gameAudio.sounds[3].pause(); 
        gameAudio.sounds[3].currentTime = 0; 
        isRunning = false; 
    }
}

// =========================
// END BOSS SOUND
// =========================
function playEndbossSound() { 
    if(gameAudio) gameAudio.play(4); // Endboss
}

// =========================
// KEYBOARD EVENTS
// =========================
window.addEventListener('keydown', (e) => {
    if(e.keyCode == 39) keyboard.RIGHT = true;
    if(e.keyCode == 37) keyboard.LEFT = true;
    if(e.keyCode == 38) keyboard.UP = true;
    if(e.keyCode == 40) keyboard.DOWN = true;
    if(e.keyCode == 32) { 
        keyboard.SPACE = true;
        keyboard.UP = true; // Leertaste = Jump
        triggerJump(); 
    }
    if(e.keyCode == 68) keyboard.D = true;
});

window.addEventListener('keyup', (e) => {
    if(e.keyCode == 39) keyboard.RIGHT = false;
    if(e.keyCode == 37) keyboard.LEFT = false;
    if(e.keyCode == 38) keyboard.UP = false;
    if(e.keyCode == 40) keyboard.DOWN = false;
    if(e.keyCode == 32) { 
        keyboard.SPACE = false;
        keyboard.UP = false; // Leertaste loslassen
    }
    if(e.keyCode == 68) keyboard.D = false;
});

// =========================
// CONTROL BUTTONS
// =========================
function bindControlButtons() {
    document.getElementById('btnLeft').addEventListener('pointerdown', ()=>keyboard.LEFT=true);
    document.getElementById('btnLeft').addEventListener('pointerup', ()=>keyboard.LEFT=false);

    document.getElementById('btnRight').addEventListener('pointerdown', ()=>keyboard.RIGHT=true);
    document.getElementById('btnRight').addEventListener('pointerup', ()=>keyboard.RIGHT=false);

    document.getElementById('jumpBTN').addEventListener('pointerdown', ()=>{ 
        keyboard.UP=true; 
        triggerJump(); 
    });
    document.getElementById('jumpBTN').addEventListener('pointerup', ()=>keyboard.UP=false);

    document.getElementById('throw').addEventListener('pointerdown', ()=>keyboard.D=true);
    document.getElementById('throw').addEventListener('pointerup', ()=>keyboard.D=false);
}

// =========================
// RESTART / MENU
// =========================
function restartGame() { location.reload(); }
function backToMenu() { location.href="index.html"; }