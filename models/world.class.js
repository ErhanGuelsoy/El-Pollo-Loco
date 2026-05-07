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

    // =========================
    // CHICKEN DELAY START
    // =========================
    setWorld() {
        this.character.world = this;

        this.level.enemies.forEach(enemy => {

            if (enemy instanceof Endboss) {
                enemy.world = this;
            }

            if (enemy instanceof Chicken) {
                enemy.active = false;

                setTimeout(() => {
                    enemy.active = true;
                }, 1000 + Math.random() * 3000);
            }
        });
    }

    // =========================
    // GAME LOOP
    // =========================
    run() {

        setInterval(() => {

            if (this.gameEnded) return;

            this.checkCollisions();
            this.checkCoins();
            this.checkThrowObjects();

            this.level.enemies = this.level.enemies.filter(
                e => !e.markedForDeletion
            );

            if (this.keyboard.RIGHT && this.character.x < this.level.level_end_x) {
                this.character.moveRight();
            }

            if (this.keyboard.LEFT && this.character.x > 0) {
                this.character.moveLeft();
            }

            if (this.keyboard.UP) {
                this.character.jump();
            }

            // ENDBOSS TRIGGER
            if (this.character.x > 2000 && !this.endbossTriggered) {
                this.endbossTriggered = true;
            }

            // WIN
            let endboss = this.level.enemies.find(e => e instanceof Endboss);
            if (endboss && endboss.energy <= 0) {
                this.gameEnded = true;
                document.getElementById('winScreen').classList.remove('hidden');
                return;
            }

            // LOSE
            if (this.character.energy <= 0) {
                this.gameEnded = true;
                document.getElementById('loseScreen').classList.remove('hidden');
                return;
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

            if (this.character.isColliding(enemy) && !this.character.isHurt()) {
                this.character.hit();
                this.statusBars[0].setPercentage(this.character.energy);
            }

            this.throwableObjects.forEach((bottle, index) => {

                if (bottle.isColliding(enemy)) {

                    enemy.hit();

                    if (enemy instanceof Endboss) {
                        this.statusBars[2].reduceEndboss();
                    }

                    this.throwableObjects.splice(index, 1);
                }
            });
        });
    }

    // =========================
    // COINS
    // =========================
    checkCoins() {

        this.level.coins.forEach((coin, index) => {

            if (this.character.isColliding(coin)) {

                this.level.coins.splice(index, 1);

                let healthBar = this.statusBars[0];

                let newHealth = healthBar.percentage + 20;

                if (newHealth > 100) newHealth = 100;

                healthBar.setPercentage(newHealth);

                this.character.energy = newHealth;
            }
        });
    }

    // =========================
    // DRAW
    // =========================
    draw() {

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);

        this.ctx.translate(-this.camera_x, 0);

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

    // =========================
    // FIXED FLIP (NO BUGS)
    // =========================
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.x + mo.width, mo.y);
        this.ctx.scale(-1, 1);
        this.ctx.translate(-mo.x, -mo.y);
    }

    flipImageBack(mo) {
        this.ctx.restore();
    }
}