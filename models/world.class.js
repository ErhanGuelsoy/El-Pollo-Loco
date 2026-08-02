/**
 * Represents the game world and manages game state,
 * objects, collisions and rendering.
 */
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
        new StatusBar("coins", 140),
        new StatusBar("endboss", 210)
    ];

    throwableObjects = [];
    lastThrowTime = 0;
    lastCharacterHitTime = 0;
    characterHitCooldown = 300;
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
        this.level.enemies.forEach(e => e.world = this);
    }

    playSound(id) {
        window.gameAudio?.play(id);
    }

    showScreen(id) {
        document.getElementById(id).classList.remove("hidden");
    }

    endGame(screen) {
        this.gameEnded = true;
        this.disableCharacterMovement();
        this.stopAllEnemies();
        this.showScreen(screen);
        window.stopAllSounds?.();
    }

    run() {
        setInterval(() => {
            if (this.gameEnded) return;

            this.checkCollisions();
            this.checkCoins();
            this.checkBottles();
            this.checkThrowObjects();

            this.level.enemies =
                this.level.enemies.filter(e => !e.markedForDeletion);

            this.handleEndboss();
        }, 1000 / 60);
    }

    disableCharacterMovement() {
        this.keyboard.LEFT =
        this.keyboard.RIGHT =
        this.keyboard.UP =
        this.keyboard.DOWN =
        this.keyboard.SPACE =
        this.keyboard.D = false;
    }

    stopAllEnemies() {
        this.level.enemies.forEach(e => {
            e.canMove = false;
            e.speed = 0;
            e.stopMovement = true;

            if (e instanceof Endboss)
                e.isAttacking = false;
        });
    }

    checkGameOver() {
        if (this.character.isDead() && !this.gameEnded)
            this.endGame("loseScreen");
    }

    handleEndboss() {
        const boss = this.level.enemies.find(e => e instanceof Endboss);
        if (!boss) return;
    
        if (
            !this.endbossTriggered &&
            this.character.x + this.canvas.width >= boss.x
        ) {
            this.endbossTriggered = true;
            boss.hadFirstContact = true;
        }
    
        if (boss.energy <= 0 && !this.gameEnded) {
            this.endGame("winScreen");
        }
    }

    checkThrowObjects() {
        const now = Date.now();
        const bar = this.statusBars[1];

        if (
            this.keyboard.D &&
            bar.percentageBottle > 0 &&
            now - this.lastThrowTime > 800
        ) {
            this.throwableObjects.push(
                new ThrowableObject(
                    this.character.x + 100,
                    this.character.y + 100,
                    this
                )
            );

            this.lastThrowTime = now;
            bar.setPercentageBottle(
                Math.max(bar.percentageBottle - 20, 0)
            );
        }
    }

    checkCollisions() {
        this.level.enemies.forEach(e => {
            this.checkCharacterEnemyCollision(e);
            this.checkBottleEnemyCollision(e);
        });

        this.checkGameOver();
    }

    checkCharacterEnemyCollision(enemy) {
        if (!this.character.isColliding(enemy)) return;

        if (enemy instanceof Chicken)
            return this.handleChickenCollision(enemy);

        if (enemy instanceof Endboss)
            this.handleEndbossCollision(enemy);
    }

    handleChickenCollision(enemy) {
        if (enemy.energy <= 0 || enemy.markedForDeletion) return;

        const bottom = this.character.y + this.character.height;

        const falling =
            this.character.speedY < 0 &&
            bottom <= enemy.y + 50;

        if (falling) {
            enemy.hit();

            this.character.y =
                enemy.y - this.character.height;

            this.character.speedY = 0;
            this.character.isJumping = false;

            this.playSound(0);
            return;
        }

        const now = Date.now();

        if (now - this.lastCharacterHitTime >= this.characterHitCooldown) {
            this.lastCharacterHitTime = now;
            this.character.hit();

            this.statusBars[0]
                .setPercentage(this.character.energy);
        }
    }

    handleEndbossCollision(enemy) {
        if (enemy.isDead() || this.character.isDead()) return;

        const now = Date.now();

        if (now - this.lastCharacterHitTime < this.characterHitCooldown)
            return;

        this.lastCharacterHitTime = now;

        this.character.energy =
            Math.max(this.character.energy - 10, 0);

        this.statusBars[0]
            .setPercentage(this.character.energy);

        this.character.lastHit = Date.now();

        if (this.character.x < enemy.x) {
            this.character.x -= 20;
            this.character.otherDirection = true;
        } else {
            this.character.x += 20;
            this.character.otherDirection = false;
        }

        this.playSound(0);
    }

    checkBottleEnemyCollision(enemy) {
        this.throwableObjects.forEach((bottle, i) => {
            if (!bottle.isColliding(enemy)) return;

            if (enemy instanceof Endboss) {
                enemy.hit();

                this.statusBars[3]
                    .setPercentageEndboss(enemy.energy);

                this.playSound(4);
            } else {
                enemy.hit();
            }

            this.throwableObjects.splice(i, 1);
        });
    }

    checkCoins() {
        if (!this.level.coins) return;

        this.level.coins.forEach((coin, i) => {
            if (!this.character.isCollecting(coin)) return;

            this.level.coins.splice(i, 1);

            const bar = this.statusBars[2];

            bar.setPercentageCoins(
                Math.min(bar.percentageCoins + 20, 100)
            );

            this.playSound(2);
        });
    }

    checkBottles() {
        if (!this.level.bottles) return;

        const bar = this.statusBars[1];

        if (bar.percentageBottle >= 100) return;

        this.level.bottles.forEach((bottle, i) => {
            if (!this.character.isCollecting(bottle)) return;

            this.level.bottles.splice(i, 1);

            bar.setPercentageBottle(
                Math.min(bar.percentageBottle + 20, 100)
            );

            this.playSound(2);
        });
    }

    draw() {
        this.ctx.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);

        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBars[0]);
        this.addToMap(this.statusBars[1]);
        this.addToMap(this.statusBars[2]);

        if (this.endbossTriggered) {
            const bar = this.statusBars[3];

            bar.x = this.canvas.width - bar.width - 10;
            bar.y = 10;

            this.addToMap(bar);
        }

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.enemies);

        if (this.level.coins)
            this.addObjectsToMap(this.level.coins);

        if (this.level.bottles)
            this.addObjectsToMap(this.level.bottles);

        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);

        this.ctx.translate(-this.camera_x, 0);

        requestAnimationFrame(() => this.draw());
    }

    addObjectsToMap(objects) {
        objects.forEach(o => this.addToMap(o));
    }

    addToMap(mo) {
        if (mo.otherDirection)
            this.flipImage(mo);

        mo.draw(this.ctx);

        if (mo.otherDirection)
            this.flipImageBack(mo);
    }

    flipImage(mo) {
        this.ctx.save();

        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);

        mo.x *= -1;
    }

    flipImageBack(mo) {
        mo.x *= -1;
        this.ctx.restore();
    }
}