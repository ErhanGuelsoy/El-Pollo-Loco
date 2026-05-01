let keyboard = new Keyboard();
let canvas;
let world;

function init(){
    canvas = document.getElementById('canvas');
    document.getElementById('start_game').addEventListener('click', startGame);
    document.getElementById('startBTN').addEventListener('click', startGame);
}


function startGame(){

    // Startscreen ausblenden
    document.getElementById('start_game').style.display = 'none';

    // Play Overlay ausblenden
    document.getElementById('playOverlay').style.display = 'none';

    // Level laden
    initLevel();

    // World erstellen
    world = new World(canvas, keyboard);

    // Touch Controls aktivieren
    bindControlButtons();
}

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

function bindControlButtons() {

    document.getElementById('btnLeft').addEventListener('pointerdown', (e) => {
        e.preventDefault();
        keyboard.LEFT = true;
    });

    document.getElementById('btnLeft').addEventListener('pointerup', (e) => {
        e.preventDefault();
        keyboard.LEFT = false;
    });

    document.getElementById('btnRight').addEventListener('pointerdown', (e) => {
        e.preventDefault();
        keyboard.RIGHT = true;
    });

    document.getElementById('btnRight').addEventListener('pointerup', (e) => {
        e.preventDefault();
        keyboard.RIGHT = false;
    });

    document.getElementById('jumpBTN').addEventListener('pointerdown', (e) => {
        e.preventDefault();
        keyboard.UP = true;

        if (world && world.character) {
            world.character.jump();
        }
    });

    document.getElementById('jumpBTN').addEventListener('pointerup', (e) => {
        e.preventDefault();
        keyboard.UP = false;
    });

    document.getElementById('throw').addEventListener('pointerdown', (e) => {
        e.preventDefault();
        keyboard.D = true;
    });

    document.getElementById('throw').addEventListener('pointerup', (e) => {
        e.preventDefault();
        keyboard.D = false;
    });
}