let keyboard = new Keyboard();
let canvas;
let world;

function init(){
    canvas = document.getElementById('canvas');
    document.getElementById('start_game').addEventListener('click', startGame);
    document.getElementById('startBTN').addEventListener('click', startGame);
}

function startGame(){

    document.getElementById('start_game').style.display = 'none';
    document.getElementById('playOverlay').style.display = 'none';
    document.getElementById('winScreen').classList.add('hidden');

    initLevel();
    world = new World(canvas, keyboard);

    bindControlButtons();
}

function restartGame() {
    location.reload();
}

function backToMenu() {
    location.reload();
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

    document.getElementById('btnLeft').addEventListener('pointerdown', e => keyboard.LEFT = true);
    document.getElementById('btnLeft').addEventListener('pointerup', e => keyboard.LEFT = false);

    document.getElementById('btnRight').addEventListener('pointerdown', e => keyboard.RIGHT = true);
    document.getElementById('btnRight').addEventListener('pointerup', e => keyboard.RIGHT = false);

    document.getElementById('jumpBTN').addEventListener('pointerdown', e => keyboard.UP = true);
    document.getElementById('jumpBTN').addEventListener('pointerup', e => keyboard.UP = false);

    document.getElementById('throw').addEventListener('pointerdown', e => keyboard.D = true);
    document.getElementById('throw').addEventListener('pointerup', e => keyboard.D = false);
}