/**
 * Global game variables for keyboard input, canvas,
 * game world, audio and sound control.
 */
let keyboard = new Keyboard();
let canvas;
let world;
let gameAudio;
let isMuted = localStorage.getItem("elPolloLocoMuted") === "true";
let canJumpSound = true;
let canPlayCoinSound = true;

/**
 * Initializes the game.
 */
function init() {
    canvas = document.getElementById("canvas");
    setupStartButtons();
    updateMuteButton();
    initModal("imprintBTN", "imprintWindow", "closeImprint");
    initModal("privacyBTN", "privacyWindow", "closePrivacy");
}

/**
 * Sets up the start screen buttons.
 */
function setupStartButtons() {
    const screen = document.getElementById("start_game");
    const start = document.getElementById("startBTN");
    const audio = document.getElementById("outsideAudioBTN");
    screen?.addEventListener("click", startGame);
    start?.addEventListener("click", startGame);
    audio?.addEventListener("click", toggleMute);
}

/**
 * Toggles the mute state of the game audio.
 */
function toggleMute() {
    isMuted = !isMuted;
    localStorage.setItem("elPolloLocoMuted", isMuted);
    gameAudio?.muteAll(isMuted);
    updateMuteButton();
    document.getElementById("outsideAudioBTN")?.blur();
}

/**
 * Updates the mute button.
 */
function updateMuteButton() {
    const button = document.getElementById("outsideAudioBTN");
    const label = document.getElementById("audioLabel");
    if (!button) return;
    button.innerText = isMuted ? "🔇" : "🔊";
    if (label) label.innerText = isMuted ? "Unmute" : "Mute";
}

/**
 * Initializes a modal window.
 *
 * @param {string} buttonId - ID of the open button.
 * @param {string} windowId - ID of the modal window.
 * @param {string} closeId - ID of the close button.
 */
function initModal(buttonId, windowId, closeId) {
    const button = document.getElementById(buttonId);
    const modal = document.getElementById(windowId);
    const close = document.getElementById(closeId);
    button?.addEventListener("click", () => modal?.classList.remove("hidden"));
    close?.addEventListener("click", () => modal?.classList.add("hidden"));
    modal?.addEventListener("click", event => closeWindow(event, modal));
}

/**
 * Closes a modal window when clicking outside its content.
 *
 * @param {MouseEvent} event - Mouse event.
 * @param {HTMLElement} modal - Modal window.
 */
function closeWindow(event, modal) {
    if (event.target === modal) modal.classList.add("hidden");
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
 * Creates the game audio instance.
 */
function createGameAudio() {
    gameAudio = new GameAudio();
    window.gameAudio = gameAudio;
    gameAudio.muteAll(isMuted);
}

/**
 * Starts background music.
 */
function startBackgroundMusic() {
    if (!gameAudio) return;
    gameAudio.startMusic();
    if (isMuted) gameAudio.muteAll(true);
}

/**
 * Restarts the game.
 */
function restartGame() {
    resetGameWorld();
    resetCanvas();
    hideScreens();
    initLevel();
    keyboard = new Keyboard();
    createGameAudio();
    world = new World(canvas, keyboard);
    startBackgroundMusic();
    bindControlButtons();
}

/**
 * Resets the current game world.
 */
function resetGameWorld() {
    if (world) {
        world.gameEnded = true;
        world = null;
    }
    resetMobileMovement();
    stopAllSounds();
}

/**
 * Clears the game canvas.
 */
function resetCanvas() {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Hides all game screens.
 */
function hideScreens() {
    document.getElementById("start_game").style.display = "none";
    document.getElementById("playOverlay").style.display = "none";
    document.getElementById("winScreen").classList.add("hidden");
    document.getElementById("loseScreen").classList.add("hidden");
}

/**
 * Stops all game sounds.
 */
function stopAllSounds() {
    gameAudio?.stopAll();
}

/**
 * Plays the jump sound.
 */
function triggerJump() {
    if (!gameAudio || !canJumpSound) return;
    gameAudio.play(1);
    canJumpSound = false;
    setTimeout(() => canJumpSound = true, 300);
}

/**
 * Plays the endboss sound.
 */
function playEndbossSound() {
    gameAudio?.play(4);
}

/**
 * Plays the coin sound.
 */
function playCoinSound() {
    if (!gameAudio || !canPlayCoinSound) return;
    gameAudio.play(2);
    canPlayCoinSound = false;
    setTimeout(() => canPlayCoinSound = true, 200);
}

/**
 * Handles keyboard input.
 */
window.addEventListener("keydown", e => {
    handleMovementKeys(e);
    handleActionKeys(e);
});

/**
 * Handles keyboard movement keys.
 *
 * @param {KeyboardEvent} e - Keyboard event.
 */
function handleMovementKeys(e) {
    const keys = { 39: "RIGHT", 37: "LEFT", 38: "UP", 40: "DOWN" };
    if (keys[e.keyCode]) keyboard[keys[e.keyCode]] = true;
}

/**
 * Handles action-related keyboard input.
 *
 * @param {KeyboardEvent} e - Keyboard event.
 */
function handleActionKeys(e) {
    if (e.keyCode === 32) handleJumpKey(e);
    if (e.keyCode === 68) keyboard.D = true;
}

/**
 * Handles the jump key.
 *
 * @param {KeyboardEvent} e - Keyboard event.
 */
function handleJumpKey(e) {
    e.preventDefault();
    keyboard.SPACE = true;
    keyboard.UP = true;
    triggerJump();
}

/**
 * Handles released keyboard keys.
 */
window.addEventListener("keyup", e => {
    const keys = { 39: "RIGHT", 37: "LEFT", 38: "UP", 40: "DOWN" };
    if (keys[e.keyCode]) keyboard[keys[e.keyCode]] = false;
    if (e.keyCode === 32) releaseJumpKey();
    if (e.keyCode === 68) keyboard.D = false;
});

/**
 * Releases the jump key.
 */
function releaseJumpKey() {
    keyboard.SPACE = false;
    keyboard.UP = false;
}

/**
 * Binds all mobile control buttons.
 */
function bindControlButtons() {
    bindMovementButton(document.getElementById("leftBtn"), "LEFT");
    bindMovementButton(document.getElementById("rightBtn"), "RIGHT");
    bindJumpButton(document.getElementById("jumpBtn"));
    bindThrowButton(document.getElementById("throwBtn"));
    preventMobileContextMenu();
}

/**
 * Binds a mobile movement button.
 *
 * @param {HTMLElement} button - Movement button.
 * @param {string} direction - Movement direction.
 */
function bindMovementButton(button, direction) {
    if (!button || button.dataset.bound) return;
    button.dataset.bound = "true";
    bindMovementEvents(button, direction);
}

/**
 * Binds movement events to a mobile button.
 *
 * @param {HTMLElement} button - Movement button.
 * @param {string} direction - Movement direction.
 */
function bindMovementEvents(button, direction) {
    const start = event => startMovement(event, button, direction);
    const stop = () => releaseMovement(button, direction);
    button.addEventListener("pointerdown", start);
    button.addEventListener("pointerup", stop);
    button.addEventListener("pointercancel", stop);
    button.addEventListener("lostpointercapture", stop);
    button.addEventListener("mouseleave", stop);
}

/**
 * Starts movement from a mobile button.
 *
 * @param {PointerEvent} event - Pointer event.
 * @param {HTMLElement} button - Movement button.
 * @param {string} direction - Movement direction.
 */
function startMovement(event, button, direction) {
    event.preventDefault();
    event.stopPropagation();
    button.setPointerCapture(event.pointerId);
    keyboard[direction] = true;
    button.classList.add("active");
}

/**
 * Releases a mobile movement button.
 *
 * @param {HTMLElement} button - Movement button.
 * @param {string} direction - Movement direction.
 */
function releaseMovement(button, direction) {
    keyboard[direction] = false;
    button.classList.remove("active");
}

/**
 * Resets mobile movement controls.
 */
function resetMobileMovement() {
    keyboard.LEFT = false;
    keyboard.RIGHT = false;
    document.getElementById("leftBtn")?.classList.remove("active");
    document.getElementById("rightBtn")?.classList.remove("active");
}

/**
 * Prevents the mobile browser context menu.
 */
function preventMobileContextMenu() {
    const controls = document.querySelector(".mobile-controls");
    if (!controls || controls.dataset.contextMenuBound) return;
    controls.dataset.contextMenuBound = "true";
    controls.addEventListener("contextmenu", e => e.preventDefault());
}

/**
 * Binds the jump button.
 *
 * @param {HTMLElement} button - Jump button.
 */
function bindJumpButton(button) {
    if (!button || button.dataset.bound) return;
    button.dataset.bound = "true";
    bindActionButton(button, "UP");
}

/**
 * Binds the throw button.
 *
 * @param {HTMLElement} button - Throw button.
 */
function bindThrowButton(button) {
    if (!button || button.dataset.bound) return;
    button.dataset.bound = "true";
    bindActionButton(button, "D");
}

/**
 * Binds an action button.
 *
 * @param {HTMLElement} button - Action button.
 * @param {string} action - Keyboard action to activate.
 */
function bindActionButton(button, action) {
    button.addEventListener("pointerdown", event => {
        event.preventDefault();
        event.stopPropagation();
        button.setPointerCapture(event.pointerId);
        keyboard[action] = true;
        if (action === "UP") triggerJump();
    });
    bindActionRelease(button, action);
}

/**
 * Binds release events for an action button.
 *
 * @param {HTMLElement} button - Action button.
 * @param {string} action - Keyboard action to release.
 */
function bindActionRelease(button, action) {
    const release = event => {
        event.preventDefault();
        keyboard[action] = false;
        if (button.hasPointerCapture(event.pointerId)) {
            button.releasePointerCapture(event.pointerId);
        }
    };
    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);
    button.addEventListener("lostpointercapture", () => keyboard[action] = false);
    button.addEventListener("contextmenu", event => {
        event.preventDefault();
        keyboard[action] = false;
    });
}

/**
 * Returns to the main menu.
 */
function backToMenu() {
    resetMobileMovement();
    location.href = "index.html";
}

window.stopAllSounds = stopAllSounds;
window.triggerJump = triggerJump;
window.playEndbossSound = playEndbossSound;
window.playCoinSound = playCoinSound;
window.init = init;
window.startGame = startGame;
window.restartGame = restartGame;
window.backToMenu = backToMenu;