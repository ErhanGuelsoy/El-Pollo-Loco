class World {

    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;

    statusBars = [
        new StatusBar("health"),
        new StatusBar("bottle"),
        new StatusBar("endboss")
    ];

    throwableObjects = [];
    lastThrowTime = 0;
    endbossTriggered = false;

    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.keyboard = keyboard;

        this.setWorld();
        // POSITIONEN
        this.statusBars[0].x = 20;
        this.statusBars[0].y = 0;
        this.statusBars[1].x = 20;
        this.statusBars[1].y = 70;
        this.statusBars[2].x = 20;
        this.statusBars[2].y = 140;

        // INIT
        this.statusBars[0].setPercentage(100);
        this.statusBars[1].setPercentageBottle(100);
        this.statusBars[2].setPercentageEndboss(100);
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

    run() {
        setInterval(() => {

            this.checkCollisions();
            this.checkThrowObjects();

            if (this.keyboard.RIGHT && this.character.x < this.level.level_end_x) {
                this.character.moveRight();
            }

            if (this.keyboard.LEFT && this.character.x > 0) {
                this.character.moveLeft();
            }

            if (this.keyboard.UP) {
                this.character.jump();
            }

            if (this.character.x > 2300 && !this.endbossTriggered) {
                this.endbossTriggered = true;

                this.level.enemies.forEach(enemy => {
                    if (enemy instanceof Endboss) {
                        enemy.hadFirstContact = true;
                    }
                });
            }

        }, 1000 / 60);
    }

    // =========================
    // THROW LOGIC
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
            // 🔥 STATUSBAR -20%
            let bottleBar = this.statusBars[1];

            let newValue = bottleBar.percentageBottle - 20;
            if (newValue < 0) newValue = 0;

            bottleBar.setPercentageBottle(newValue);
        }
    }

    checkCollisions() {
        this.level.enemies.forEach((enemy) => {

            if (this.character.isColliding(enemy) && !this.character.isHurt()) {

                this.character.hit();

                // HEALTH UPDATE
                this.statusBars[0].setPercentage(this.character.energy);
            }
        });
    }

    // =========================
    // DRAW LOOP
    // =========================
    draw() {

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.ctx.translate(-this.camera_x, 0);

        // UI
        this.statusBars.forEach(bar => {
            this.addToMap(bar);
        });

        this.ctx.translate(this.camera_x, 0);

        // GAME
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);

        this.ctx.translate(-this.camera_x, 0);

        requestAnimationFrame(() => this.draw());
    }

    addObjectsToMap(objects) {
        objects.forEach(o => this.addToMap(o));
    }

    addToMap(mo) {

        if (mo.otherDirection) {
            this.flipImage(mo);
        }

        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
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