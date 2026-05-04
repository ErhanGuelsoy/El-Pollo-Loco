class GameAudio {

    AUDIO_FILES = [
        "audio/dragon-studio-car-crash-sound-376882.mp3",
        "audio/freesound_community-cartoon-jump-6462.mp3",
        "audio/liecio-collect-points-190037.mp3",
        "audio/spinopel-run-on-asphalt-road-393093.mp3",
        "audio/freesound_community-chicken-single-alarm-call-6056.mp3" // 🐔 END BOSS
    ];

    constructor() {
        this.sounds = [];
        this.loadSounds();
    }

    loadSounds() {
        this.AUDIO_FILES.forEach((path, i) => {
            let audio = new Audio(path);
            audio.preload = "auto";

            // 🏃 RUN LOOP
            if (i === 3) {
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

// ================= GLOBALS =================
let keyboard = new Keyboard();
let canvas;
let world;
let gameAudio;
let isMuted = false;

let canJumpSound = true;
let isRunning = false;

// ================= INIT =================
function init(){
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

// ================= START GAME =================
function startGame(){

    document.getElementById('start_game').style.display = 'none';
    document.getElementById('playOverlay').style.display = 'none';
    document.getElementById('winScreen').classList.add('hidden');

    initLevel();
    world = new World(canvas, keyboard);

    gameAudio = new GameAudio();
    gameAudio.unlock(); // 🔓 IMPORTANT

    bindControlButtons();
}

// ================= JUMP =================
function triggerJump() {
    if (!gameAudio || !canJumpSound) return;

    gameAudio.play(1);

    canJumpSound = false;

    setTimeout(() => {
        canJumpSound = true;
    }, 300);
}

// ================= RUN =================
function handleRunSound() {

    if (!gameAudio) return;

    const moving = keyboard.LEFT || keyboard.RIGHT;

    if (moving && !isRunning) {
        gameAudio.sounds[3].play().catch(() => {});
        isRunning = true;
    }

    if (!moving && isRunning) {
        gameAudio.sounds[3].pause();
        gameAudio.sounds[3].currentTime = 0;
        isRunning = false;
    }
}

// ================= END BOSS SOUND (SAFE) =================
function playEndbossSound() {
    if (gameAudio) {
        gameAudio.play(4); // 🐔 END BOSS SOUND
    }
}

// ================= KEYBOARD =================
window.addEventListener('keydown', (e) => {

    if (e.keyCode == 39) keyboard.RIGHT = true;
    if (e.keyCode == 37) keyboard.LEFT = true;
    if (e.keyCode == 38) keyboard.UP = true;
    if (e.keyCode == 40) keyboard.DOWN = true;

    if (e.keyCode == 32) {
        keyboard.SPACE = true;
        triggerJump();
    }

    if (e.keyCode == 68) keyboard.D = true;
});

window.addEventListener('keyup', (e) => {

    if (e.keyCode == 39) keyboard.RIGHT = false;
    if (e.keyCode == 37) keyboard.LEFT = false;
    if (e.keyCode == 38) keyboard.UP = false;
    if (e.keyCode == 40) keyboard.DOWN = false;
    if (e.keyCode == 32) keyboard.SPACE = false;
    if (e.keyCode == 68) keyboard.D = false;
});

// ================= CONTROLS =================
function bindControlButtons() {

    document.getElementById('btnLeft').addEventListener('pointerdown', e => keyboard.LEFT = true);
    document.getElementById('btnLeft').addEventListener('pointerup', e => keyboard.LEFT = false);

    document.getElementById('btnRight').addEventListener('pointerdown', e => keyboard.RIGHT = true);
    document.getElementById('btnRight').addEventListener('pointerup', e => keyboard.RIGHT = false);

    document.getElementById('jumpBTN').addEventListener('pointerdown', e => {
        keyboard.UP = true;
        triggerJump();
    });

    document.getElementById('jumpBTN').addEventListener('pointerup', e => {
        keyboard.UP = false;
    });

    document.getElementById('throw').addEventListener('pointerdown', e => keyboard.D = true);
    document.getElementById('throw').addEventListener('pointerup', e => keyboard.D = false);
}