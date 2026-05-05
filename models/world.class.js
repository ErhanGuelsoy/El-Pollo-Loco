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

        this.draw();
        this.run();
    }

    setWorld() {
        this.character.world = this;

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

            // Entferne markierte Gegner
            this.level.enemies = this.level.enemies.filter(e => !e.markedForDeletion);

            // Charakterbewegung
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
                    if (enemy instanceof Endboss) {
                        enemy.hadFirstContact = true;
                    }
                });
            }

            // WIN CONDITION
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

            // =========================
            // CHARACTER HIT ENEMY
            // =========================
            if (this.character.isColliding(enemy) && !this.character.isHurt()) {
                this.character.hit();
                this.statusBars[0].setPercentage(this.character.energy);
            }

            // =========================
            // BOTTLE COLLISION
            // =========================
            this.throwableObjects.forEach((bottle, index) => {

                if (bottle.isColliding(enemy)) {

                    // Gegner trifft Flasche
                    enemy.hit();

                    // 🔊 Chicken-Death-Sound abspielen
                    if (enemy instanceof Chicken && enemy.isDead() && gameAudio) {
                        gameAudio.play(5); // Chicken-Death
                    }

                    // 🔥 Endboss-Treffer & Sound
                    if (enemy instanceof Endboss && gameAudio) {
                        this.statusBars[2].reduceEndboss();
                        playEndbossSound();
                    }

                    // Flasche entfernen
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
        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);

        this.ctx.translate(-this.camera_x, 0);

        this.statusBars.forEach(bar => {
            this.addToMap(bar);
        });

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