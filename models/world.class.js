// =========================
// World.js
// =========================
class World {

    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;

    statusBars = [
        new StatusBar("health", 0),
        new StatusBar("bottle", 70),
        new StatusBar("endboss", 140)
    ];

    throwableObjects = [];
    lastThrowTime = 0;
    endbossTriggered = false;

    gameEnded = false;

    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.keyboard = keyboard;

        this.setWorld();

        this.draw(); // startet Zeichenloop
        this.run();  // startet Game-Loop
    }

    setWorld() {
        this.character.world = this;

        // Enemies der Welt zuweisen
        this.level.enemies.forEach(enemy => {
            if (enemy instanceof Endboss) {
                enemy.world = this;
            }
        });
    }

    // =========================
    // WIN SCREEN
    // =========================
    showWinScreen() {
        document.getElementById('winScreen').classList.remove('hidden');
    }

    // =========================
    // GAME LOOP
    // =========================
    run() {
        setInterval(() => {

            if (this.gameEnded) return;

            this.checkCollisions();
            this.checkThrowObjects();

            // Enemies, die markiert sind, entfernen
            this.level.enemies = this.level.enemies.filter(e => !e.markedForDeletion);

            // Character Steuerung
            if (this.keyboard.RIGHT && this.character.x < this.level.level_end_x) {
                this.character.moveRight();
            }

            if (this.keyboard.LEFT && this.character.x > 0) {
                this.character.moveLeft();
            }

            if (this.keyboard.UP) {
                this.character.jump();
            }

            // Endboss Trigger
            if (this.character.x > 2300 && !this.endbossTriggered) {
                this.endbossTriggered = true;
                this.level.enemies.forEach(enemy => {
                    if (enemy instanceof Endboss) enemy.hadFirstContact = true;
                });
            }

            // Win Condition
            let endboss = this.level.enemies.find(e => e instanceof Endboss);
            if (endboss && endboss.energy <= 0 && !this.gameEnded) {
                this.gameEnded = true;
                this.showWinScreen();
            }

        }, 1000 / 60);
    }

    // =========================
    // THROW OBJECTS
    // =========================
    checkThrowObjects() {
        let now = new Date().getTime();
        if (this.keyboard.D && now - this.lastThrowTime > 800) {

            let bottle = new ThrowableObject(
                this.character.x + 100,
                this.character.y + 100,
                this
            );

            this.throwableObjects.push(bottle);
            this.lastThrowTime = now;

            // Bottle Bar Update
            let bottleBar = this.statusBars[1];
            let newValue = bottleBar.percentageBottle - 20;
            if (newValue < 0) newValue = 0;
            bottleBar.setPercentageBottle(newValue);
        }
    }

    // =========================
    // COLLISIONS
    // =========================
    checkCollisions() {

        this.level.enemies.forEach((enemy) => {

            // CHARACTER HITS ENEMY
            if (this.character.isColliding(enemy) && !this.character.isHurt()) {
                this.character.hit();
                this.statusBars[0].setPercentage(this.character.energy);
            }

            // THROWABLE HITS ENEMY
            this.throwableObjects.forEach((bottle, index) => {
                if (bottle.isColliding(enemy)) {
                    if (enemy instanceof Endboss) {
                        enemy.hit();
                        this.statusBars[2].reduceEndboss();
                        if (window.playEndbossSound) playEndbossSound();
                    } else {
                        enemy.hit();
                    }
                    this.throwableObjects.splice(index, 1);
                }
            });
        });
    }

    // =========================
    // DRAW LOOP
    // =========================
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Kamera verschieben
        this.ctx.translate(this.camera_x, 0);

        // Objekte zeichnen
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        if (this.level.coins) this.addObjectsToMap(this.level.coins); // Coins hinzufügen
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);

        // Kamera zurücksetzen
        this.ctx.translate(-this.camera_x, 0);

        // Statusbars
        this.statusBars.forEach(bar => this.addToMap(bar));

        requestAnimationFrame(() => this.draw());
    }

    // =========================
    // HELPERS
    // =========================
    addObjectsToMap(objects) {
        objects.forEach(o => this.addToMap(o));
    }

    addToMap(mo) {
        if (mo.otherDirection) this.flipImage(mo);

        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);

        if (mo.otherDirection) this.flipImageBack(mo);
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}

// =========================
// init.js
// =========================
function init() {
    // Level + Coins vorbereiten
    initLevel(); 

    // Canvas + Keyboard
    const canvas = document.getElementById('canvas');
    const keyboard = new Keyboard();
    const world = new World(canvas, keyboard);

    // Optional: Coins sicherstellen, dass Bilder geladen sind
    if (level1.coins) {
        level1.coins.forEach(coin => coin.loadImage("img/8_coin/coin_1.png"));
    }
}