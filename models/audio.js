let keyboard = new Keyboard();
let canvas;
let world;
let gameAudio;
let isMuted = false;

/**
 * Initializes the game interface and event listeners.
 */
function init() {
    canvas = document.getElementById("canvas");
    setupStartButtons();
}

/**
 * Sets up the start and audio button event listeners.
 */
function setupStartButtons() {
    const start = document.getElementById("start_game");
    const button = document.getElementById("startBTN");
    const audio = document.getElementById("outsideAudioBTN");

    start?.addEventListener("click", startGame);
    button?.addEventListener("click", startGame);
    audio?.addEventListener("click", () => toggleMute(audio));
}

/**
 * Toggles the game audio between muted and unmuted.
 * @param {HTMLElement} button - The audio control button.
 */
function toggleMute(button) {
    if (!gameAudio) return;

    isMuted = !isMuted;
    gameAudio.muteAll(isMuted);
    button.innerText = isMuted ? "🔇" : "🔊";
    button.blur();
}

/**
 * Starts a new game and initializes its world and audio.
 */
function startGame() {
    hideScreens();
    initLevel();
    createGameAudio();
    world = new World(canvas, keyboard);
    startBackgroundMusic();
    bindControlButtons();
}

/**
 * Creates the game audio instance and applies the mute state.
 */
function createGameAudio() {
    gameAudio = new GameAudio();
    window.gameAudio = gameAudio;

    if (isMuted) {
        gameAudio.muteAll(true);
    }
}

/**
 * Restarts the game and resets its world, keyboard and audio.
 */
function restartGame() {
    resetGameWorld();
    stopAudio();
    resetCanvas();
    keyboard = new Keyboard();
    hideScreens();
    initLevel();
    createGameAudio();
    world = new World(canvas, keyboard);
    startBackgroundMusic();
    bindControlButtons();
}

/**
 * Ends the current game world and removes its reference.
 */
function resetGameWorld() {
    if (world) {
        world.gameEnded = true;
        world = null;
    }
}

/**
 * Clears the game canvas.
 */
function resetCanvas() {
    canvas.getContext("2d")
        .clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Hides the start, play and win screens.
 */
function hideScreens() {
    document.getElementById("start_game").style.display = "none";
    document.getElementById("playOverlay").style.display = "none";
    hideWin();
}

/**
 * Hides the win screen.
 */
function hideWin() {
    document.getElementById("winScreen")
        ?.classList.add("hidden");
}

/**
 * Starts and configures the game's background music.
 */
function startBackgroundMusic() {
    const music = gameAudio.sounds[7];

    music.loop = true;
    music.volume = 0.4;
    music.play().catch(() => {});
}

/**
 * Stops all currently playing game sounds.
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