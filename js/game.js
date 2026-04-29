let canvas;
let world;
let keyboard = new Keyboard();

function init(){
    canvas = document.getElementById('canvas');
}

function startGame(){
    document.getElementById('start_game').style.display = 'none';

    initLevel();
    world = new World(canvas, keyboard);

    bindControlButtons(); // 🔥 IMPORTANT
}

/* =========================
        KEYBOARD
========================= */

window.addEventListener('keydown', (e) => {

    if (e.keyCode == 39) keyboard.RIGHT = true;
    if (e.keyCode == 37) keyboard.LEFT = true;
    if (e.keyCode == 38) keyboard.UP = true;
    if (e.keyCode == 40) keyboard.DOWN = true;
    if (e.keyCode == 32) keyboard.SPACE = true;
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

/* =========================
    TOUCH / MOBILE CONTROLS (FIXED)
========================= */

function bindControlButtons() {

    // LEFT
    document.getElementById('btnLeft').addEventListener('pointerdown', (e) => {
        e.preventDefault();
        keyboard.LEFT = true;
    });

    document.getElementById('btnLeft').addEventListener('pointerup', (e) => {
        e.preventDefault();
        keyboard.LEFT = false;
    });

    // RIGHT
    document.getElementById('btnRight').addEventListener('pointerdown', (e) => {
        e.preventDefault();
        keyboard.RIGHT = true;
    });

    document.getElementById('btnRight').addEventListener('pointerup', (e) => {
        e.preventDefault();
        keyboard.RIGHT = false;
    });

    // JUMP
    document.getElementById('jumpBTN').addEventListener('pointerdown', (e) => {
        e.preventDefault();
        keyboard.UP = true;

        // 🔥 immediate jump trigger
        if (world && world.character) {
            world.character.jump();
        }
    });

    document.getElementById('jumpBTN').addEventListener('pointerup', (e) => {
        e.preventDefault();
        keyboard.UP = false;
    });

    // THROW
    document.getElementById('throw').addEventListener('pointerdown', (e) => {
        e.preventDefault();
        keyboard.D = true;
    });

    document.getElementById('throw').addEventListener('pointerup', (e) => {
        e.preventDefault();
        keyboard.D = false;
    });
}