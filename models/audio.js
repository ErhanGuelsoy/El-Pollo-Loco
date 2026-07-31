let keyboard = new Keyboard();
let canvas;
let world;
let gameAudio;
let isMuted = false;

/**
 * Initializes the game canvas and interface event listeners.
 */
function init() {
    canvas = document.getElementById("canvas");

    const startGameScreen =
        document.getElementById("start_game");

    const startButton =
        document.getElementById("startBTN");

    const outsideAudioBTN =
        document.getElementById("outsideAudioBTN");

    if (startGameScreen) {
        startGameScreen.addEventListener(
            "click",
            startGame
        );
    }

    if (startButton) {
        startButton.addEventListener(
            "click",
            startGame
        );
    }

    if (outsideAudioBTN) {
        outsideAudioBTN.addEventListener(
            "click",
            () => {
                if (!gameAudio) return;

                isMuted = !isMuted;
                gameAudio.muteAll(isMuted);

                outsideAudioBTN.innerText =
                    isMuted ? "🔇" : "🔊";

                outsideAudioBTN.blur();
            }
        );
    }
}

/**
 * Starts a new game and initializes the game world and audio.
 */
function startGame() {
    document.getElementById(
        "start_game"
    ).style.display = "none";

    document.getElementById(
        "playOverlay"
    ).style.display = "none";

    document.getElementById(
        "winScreen"
    ).classList.add("hidden");

    initLevel();

    gameAudio = new GameAudio();
    window.gameAudio = gameAudio;

    if (isMuted) {
        gameAudio.muteAll(true);
    }

    world = new World(
        canvas,
        keyboard
    );

    startBackgroundMusic();
    bindControlButtons();
}

/**
 * Restarts the current game and resets the game world and audio.
 */
function restartGame() {
    if (world) {
        world.gameEnded = true;
        world = null;
    }

    stopAudio();

    keyboard = new Keyboard();
    const ctx = canvas.getContext("2d");
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    document
        .getElementById("winScreen")
        .classList.add("hidden");

    initLevel();

    gameAudio = new GameAudio();
    window.gameAudio = gameAudio;

    if (isMuted) {
        gameAudio.muteAll(true);
    }

    world = new World(
        canvas,
        keyboard
    );

    startBackgroundMusic();
    bindControlButtons();
}

/**
 * Starts the background music and enables looping.
 */
function startBackgroundMusic() {
    const bgMusic = gameAudio.sounds[7];

    bgMusic.loop = true;
    bgMusic.volume = 0.4;
    bgMusic.play().catch(() => {});
}

/**
 * Stops all currently playing game sounds and resets their playback position.
 */
function stopAudio() {
    if (!gameAudio) return;

    gameAudio.sounds.forEach(sound => {
        sound.pause();
        sound.currentTime = 0;
    });
}

/**
 * Returns the player to the main menu.
 */
function backToMenu() {
    location.href = "index.html";
}

window.init = init;
window.startGame = startGame;
window.restartGame = restartGame;
window.backToMenu = backToMenu;