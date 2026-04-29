class World {

    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar();
    throwableObjects = [];  
    lastThrowTime = 0;

    endbossTriggered = false;

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

        // 🔥 Endboss bekommt World Zugriff
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

            // =========================
            // MOVE LEFT / RIGHT (LIMIT 2600)
            // =========================


            if (this.keyboard.RIGHT && this.character.x < this.level.level_end_x) {
                this.character.moveRight();
            }
            
            if (this.keyboard.LEFT && this.character.x > 0) {
                this.character.moveLeft();
            }

            // JUMP
            if (this.keyboard.UP) {
                this.character.jump();
            }

            // =========================
            // END BOSS TRIGGER
            // =========================

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

    checkThrowObjects() {

        let now = new Date().getTime();

        if (this.keyboard.D && now - this.lastThrowTime > 800) {

            let bottle = new ThrowableObject(
                this.character.x + 100,
                this.character.y + 100
            );

            this.throwableObjects.push(bottle);

            this.lastThrowTime = now;
        }
    }

    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy) && !this.character.isHurt()) {
                this.character.hit();
                this.statusBar.setPercentage(this.character.energy);
            }
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);

        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBar);

        this.ctx.translate(this.camera_x, 0);

        this.addToMap(this.character);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);

        this.ctx.translate(-this.camera_x, 0);

        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
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