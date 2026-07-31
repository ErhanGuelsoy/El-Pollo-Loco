let keyboard = new Keyboard();
let canvas;
let world;
let gameAudio;
let isMuted = localStorage.getItem("elPolloLocoMuted") === "true";
let canJumpSound = true;
let canPlayCoinSound = true;

/**
 * Initializes the game interface and event listeners.
 */
function init() {
    canvas = document.getElementById("canvas");

    const startGameScreen = document.getElementById("start_game");
    const startButton = document.getElementById("startBTN");
    const outsideAudioBTN = document.getElementById("outsideAudioBTN");

    updateMuteButton();

    startGameScreen?.addEventListener("click", startGame);
    startButton?.addEventListener("click", startGame);

    outsideAudioBTN?.addEventListener("click", () => {
        isMuted = !isMuted;

        localStorage.setItem(
            "elPolloLocoMuted",
            isMuted
        );

        if (gameAudio) {
            gameAudio.muteAll(isMuted);
        }

        updateMuteButton();
        outsideAudioBTN.blur();
    });

    initImprint();
    initPrivacy();
}

/**
 * Updates the mute button according to the current mute state.
 */
function updateMuteButton() {
    const outsideAudioBTN = document.getElementById("outsideAudioBTN");
    const audioLabel = document.getElementById("audioLabel");

    if (!outsideAudioBTN) return;

    outsideAudioBTN.innerText = isMuted ? "🔇" : "🔊";

    if (audioLabel) {
        audioLabel.innerText = isMuted ? "Unmute" : "Mute";
    }
}

/**
 * Initializes the imprint window and its event listeners.
 */
function initImprint() {
    const imprintBTN = document.getElementById("imprintBTN");
    const imprintWindow = document.getElementById("imprintWindow");
    const closeImprint = document.getElementById("closeImprint");

    imprintBTN?.addEventListener("click", () => {
        imprintWindow.classList.remove("hidden");
    });

    closeImprint?.addEventListener("click", () => {
        imprintWindow.classList.add("hidden");
    });

    imprintWindow?.addEventListener("click", e => {
        if (e.target === imprintWindow) {
            imprintWindow.classList.add("hidden");
        }
    });
}

/**
 * Initializes the privacy policy window and its event listeners.
 */
function initPrivacy() {
    const privacyBTN = document.getElementById("privacyBTN");
    const privacyWindow = document.getElementById("privacyWindow");
    const closePrivacy = document.getElementById("closePrivacy");

    privacyBTN?.addEventListener("click", () => {
        privacyWindow.classList.remove("hidden");
    });

    closePrivacy?.addEventListener("click", () => {
        privacyWindow.classList.add("hidden");
    });

    privacyWindow?.addEventListener("click", e => {
        if (e.target === privacyWindow) {
            privacyWindow.classList.add("hidden");
        }
    });
}

/**
 * Starts a new game and initializes the game world and audio.
 */
function startGame() {
    hideScreens();
    initLevel();

    gameAudio = new GameAudio();
    window.gameAudio = gameAudio;

    gameAudio.muteAll(isMuted);

    world = new World(canvas, keyboard);

    startBackgroundMusic();
    bindControlButtons();
}

/**
 * Starts the game's background music.
 */
function startBackgroundMusic() {
    if (!gameAudio) return;

    gameAudio.startMusic();

    if (isMuted) {
        gameAudio.muteAll(true);
    }
}

/**
 * Restarts the game and resets the game world, keyboard and audio.
 */
function restartGame() {
    if (world) {
        world.gameEnded = true;
        world = null;
    }

    stopAllSounds();

    keyboard = new Keyboard();

    const ctx = canvas.getContext("2d");

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    hideScreens();
    initLevel();

    gameAudio = new GameAudio();
    window.gameAudio = gameAudio;

    gameAudio.muteAll(isMuted);

    world = new World(canvas, keyboard);

    startBackgroundMusic();
    bindControlButtons();
}

/**
 * Hides the start, overlay, win and lose screens.
 */
function hideScreens() {
    document.getElementById("start_game").style.display = "none";
    document.getElementById("playOverlay").style.display = "none";
    document.getElementById("winScreen").classList.add("hidden");
    document.getElementById("loseScreen").classList.add("hidden");
}

/**
 * Stops all currently playing game sounds.
 */
function stopAllSounds() {
    if (!gameAudio) return;

    gameAudio.stopAll();
}

/**
 * Plays the jump sound with a short cooldown.
 */
function triggerJump() {
    if (!gameAudio || !canJumpSound) {
        return;
    }

    gameAudio.play(1);
    canJumpSound = false;

    setTimeout(() => {
        canJumpSound = true;
    }, 300);
}

/**
 * Plays the endboss sound.
 */
function playEndbossSound() {
    if (gameAudio) {
        gameAudio.play(4);
    }
}

/**
 * Plays the coin collection sound with a short cooldown.
 */
function playCoinSound() {
    if (!gameAudio || !canPlayCoinSound) {
        return;
    }

    gameAudio.play(2);
    canPlayCoinSound = false;

    setTimeout(() => {
        canPlayCoinSound = true;
    }, 200);
}

/**
 * Handles keyboard input for player movement and actions.
 * @param {KeyboardEvent} e - The keyboard event.
 */
window.addEventListener("keydown", e => {
    if (e.keyCode == 39) {
        keyboard.RIGHT = true;
    }

    if (e.keyCode == 37) {
        keyboard.LEFT = true;
    }

    if (e.keyCode == 38) {
        keyboard.UP = true;
    }

    if (e.keyCode == 40) {
        keyboard.DOWN = true;
    }

    if (e.keyCode == 32) {
        e.preventDefault();

        keyboard.SPACE = true;
        keyboard.UP = true;

        triggerJump();
    }

    if (e.keyCode == 68) {
        keyboard.D = true;
    }
});

/**
 * Handles keyboard input when a key is released.
 * @param {KeyboardEvent} e
 */
window.addEventListener("keyup", e => {
    if (e.keyCode == 39) {
        keyboard.RIGHT = false;
    }

    if (e.keyCode == 37) {
        keyboard.LEFT = false;
    }

    if (e.keyCode == 38) {
        keyboard.UP = false;
    }

    if (e.keyCode == 40) {
        keyboard.DOWN = false;
    }

    if (e.keyCode == 32) {
        keyboard.SPACE = false;
        keyboard.UP = false;
    }

    if (e.keyCode == 68) {
        keyboard.D = false;
    }
});

/**
 * Binds all mobile and touch control buttons to their actions.
 */
function bindControlButtons() {
    const btnLeft = document.getElementById("btnLeft");
    const btnRight = document.getElementById("btnRight");
    const jumpBTN = document.getElementById("jumpBTN");
    const throwButton = document.getElementById("throw");

    bindMovementButton(btnLeft, "LEFT");
    bindMovementButton(btnRight, "RIGHT");
    bindJumpButton(jumpBTN);
    bindThrowButton(throwButton);
}

/**
 * Binds a movement button to a keyboard direction.
 * @param {HTMLElement|null} button
 * @param {string} direction
 */
function bindMovementButton(button, direction) {
    if (!button) return;

    button.addEventListener("pointerdown", e => {
        e.preventDefault();
        keyboard[direction] = true;
    });

    button.addEventListener("pointerup", () => {
        keyboard[direction] = false;
    });

    button.addEventListener("pointercancel", () => {
        keyboard[direction] = false;
    });

    button.addEventListener("pointerleave", () => {
        keyboard[direction] = false;
    });
}

/**
 * Binds a button to the player's jump action.
 * @param {HTMLElement|null} button
 */
function bindJumpButton(button) {
    if (!button) return;

    button.addEventListener("pointerdown", e => {
        e.preventDefault();

        keyboard.UP = true;
        triggerJump();
    });

    button.addEventListener("pointerup", () => {
        keyboard.UP = false;
    });

    button.addEventListener("pointercancel", () => {
        keyboard.UP = false;
    });

    button.addEventListener("pointerleave", () => {
        keyboard.UP = false;
    });
}

/**
 * Binds a button to the player's throw action.
 * @param {HTMLElement|null} button
 */
function bindThrowButton(button) {
    if (!button) return;

    button.addEventListener("pointerdown", e => {
        e.preventDefault();

        keyboard.D = true;
    });

    button.addEventListener("pointerup", () => {
        keyboard.D = false;
    });

    button.addEventListener("pointercancel", () => {
        keyboard.D = false;
    });

    button.addEventListener("pointerleave", () => {
        keyboard.D = false;
    });
}

/**
 * Returns the player to the main menu.
 */
function backToMenu() {
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